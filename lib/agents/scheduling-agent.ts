import { db } from '@/lib/firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Anomaly } from '@/lib/agents/types';

export interface SchedulingResult {
  success: boolean;
  appointmentDate?: Date;
  appointmentId?: string;
  message?: string;
  error?: string;
}

/**
 * Scheduling Agent - Handles appointment booking in Firestore
 */
export async function scheduleAppointment(
  preferredDate: string,
  anomalies: Anomaly[],
  userEmail: string,
  vehicleInfo?: any
): Promise<SchedulingResult> {
  try {
    // Parse the preferred date
    const appointmentDate = new Date(preferredDate);

    if (isNaN(appointmentDate.getTime())) {
      return {
        success: false,
        error: 'Invalid date format',
      };
    }

    // Check if date is in the past
    if (appointmentDate < new Date()) {
      return {
        success: false,
        error: 'Appointment date must be in the future',
      };
    }

    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical' || a.severity === 'high');

    // Store appointment in Firestore
    const appointmentRef = await addDoc(collection(db, 'appointments'), {
      userId: userEmail,
      appointmentDate: appointmentDate.toISOString(),
      duration: criticalAnomalies.length > 0 ? 120 : 60,
      status: 'scheduled',
      vehicleInfo: vehicleInfo ? {
        vin: vehicleInfo.vin,
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: vehicleInfo.year,
      } : null,
      anomalies: anomalies.map(a => ({
        type: a.type,
        severity: a.severity,
        description: a.description,
        recommendation: a.recommendation,
      })),
      createdAt: Date.now(),
    });

    return {
      success: true,
      appointmentDate,
      appointmentId: appointmentRef.id,
      message: `Appointment scheduled for ${appointmentDate.toLocaleString()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to schedule appointment',
    };
  }
}

export async function getAppointments(email: string) {
  try {
    const q = query(collection(db, 'appointments'), where('userId', '==', email));
    const snapshot = await getDocs(q);
    const appointments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        details: {
          customerName: email,
          vehicleInfo: data.vehicleInfo ? `${data.vehicleInfo.year} ${data.vehicleInfo.make} ${data.vehicleInfo.model}` : 'Unknown Vehicle',
          issueDescription: data.anomalies?.[0]?.description || 'Maintenance Check',
        },
        schedule: {
          date: data.appointmentDate,
          status: data.status
        }
      };
    });
    return { success: true, appointments };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch appointments' };
  }
}
