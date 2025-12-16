import { db } from '@/lib/firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Anomaly, VehicleInfo } from '@/lib/agents/types';

export interface NotificationResult {
    success: boolean;
    notificationsCreated: number;
    errors?: string[];
}

/**
 * Notification Agent - Stores notifications in Firestore for in-app display
 */
export async function sendAnomalyNotifications(
    anomalies: Anomaly[],
    vehicleInfo: VehicleInfo[],
    userEmail?: string
): Promise<NotificationResult> {
    if (anomalies.length === 0) {
        return {
            success: true,
            notificationsCreated: 0,
        };
    }

    const errors: string[] = [];
    let notificationsCreated = 0;

    try {
        // Store notifications in Firestore for in-app display
        for (const anomaly of anomalies) {
            const vehicle = vehicleInfo.find(v => v.vin === anomaly.vin || anomaly.vehicleId.includes(String(vehicleInfo.indexOf(v))));

            // Clean data - remove undefined values for Firestore
            const notificationData: any = {
                userId: userEmail || 'anonymous',
                anomaly: {
                    id: anomaly.id,
                    type: anomaly.type,
                    severity: anomaly.severity,
                    description: anomaly.description,
                    recommendation: anomaly.recommendation,
                },
                read: false,
                createdAt: Date.now(),
            };

            // Only add vehicle info if it exists and has data
            if (vehicle && vehicle.vin) {
                notificationData.vehicleInfo = {
                    vin: vehicle.vin,
                    make: vehicle.make || 'Unknown',
                    model: vehicle.model || 'Unknown',
                    year: vehicle.year || 0,
                };
            }

            // Add affected component if it exists
            if (anomaly.affectedComponent) {
                notificationData.anomaly.affectedComponent = anomaly.affectedComponent;
            }

            await addDoc(collection(db, 'notifications'), notificationData);
            notificationsCreated++;
        }

        return {
            success: true,
            notificationsCreated,
        };
    } catch (error) {
        console.error('Notification error:', error);
        return {
            success: false,
            notificationsCreated,
            errors: [error instanceof Error ? error.message : 'Failed to create notifications'],
        };
    }
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userEmail: string) {
    try {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userEmail)
        );

        const querySnapshot = await getDocs(q);
        const notifications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { success: true, notifications };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        };
    }
}
