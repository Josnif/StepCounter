import { useEffect, useState } from "react";
import { Platform } from "react-native";
import AppleHealthKit, {
    HealthInputOptions,
    HealthKitPermissions,
    HealthUnit,
} from "react-native-health";
import {
    initialize,
    requestPermission,
    readRecords,
} from 'react-native-health-connect'
import { Permission } from "react-native-health-connect/lib/typescript/types";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

const { Permissions } = AppleHealthKit.Constants;

const permissions: HealthKitPermissions = {
    permissions: {
        read: [
            Permissions.Steps,
            Permissions.FlightsClimbed,
            Permissions.DistanceWalkingRunning
        ],
        write: []
    }
}

const useHealthData = (date: Date) => {
    const [steps, setSteps] = useState(0);
    const [flights, setFlights] = useState(0);
    const [distance, setDistance] = useState(0);
    const [hasPermissions, setHasPermissions] = useState(false);
    const [androidPermissions, setAndroidPermissions] = useState(<Permission[]>([]));

    useEffect(() => {
        if (Platform.OS !== 'ios') {
            return;
        }
        AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err) {
                console.log('Error getting permissions');
                return;
            }
            setHasPermissions(true);
        });
    }, []);

    useEffect(() => {
        if (!hasPermissions) return;

        const options: HealthInputOptions = {
            date: new Date().toISOString(),
            includeManuallyAdded: false,
        }

        // GET STEPS QUERY
        AppleHealthKit.getStepCount(options, (err, result) => {
            if (err) {
                console.log('Error getting the steps');
                return;
            }
            setSteps(result.value);
        });

        // GET FLIGHTS CLIMBED QUERY
        AppleHealthKit.getFlightsClimbed(options, (err, results) => {
            if (err) {
                console.log('Error getting the Flights Climbed:', err);
                return;
            }
            setFlights(results.value)
        });
        
        // GET DISTANCE QUERY
        AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
            if (err) {
                console.log('Error getting the Distance:', err);
                return;
            }
            setDistance(results.value)
        });


    }, [hasPermissions, date])

    // ANDROID LOGIC
    useEffect(() => {
        if (Platform.OS !== 'android') {
            return;
        }
        
        const init = async () => {
            const isInitialized = await initialize();
            if (!isInitialized) {
                console.log('Failed to initialize Health Connect');
            }

            const grantedPermissions = await requestPermission([
                {accessType: 'read', recordType: 'Steps'},
                {accessType: 'read', recordType: 'Distance'},
                {accessType: 'read', recordType: 'FloorsClimbed'},
            ]);

            setAndroidPermissions(grantedPermissions);
        };

        init();
    }, [])

    const hasAndroidPermissions = (recordType: string) => {
        return androidPermissions.some(perm => perm.recordType === recordType);
    }

    useEffect(() => {
        if (!hasAndroidPermissions('Steps')) {
            return;
        }

        const getHealthData = async () => {
            const today = new Date();
            const timeRangeFilter: TimeRangeFilter = {
                operator: 'between',
                startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
                endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
            }

            // Steps
            const steps = await readRecords('Steps', {timeRangeFilter});
            const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
            setSteps(totalSteps);
        }

        getHealthData();
    }, [androidPermissions]);
    
    useEffect(() => {
        if (!hasAndroidPermissions('Distance')) {
            return;
        }

        const getHealthData = async () => {
            const today = new Date();
            const timeRangeFilter: TimeRangeFilter = {
                operator: 'between',
                startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
                endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
            }

            // Steps
            const distance = await readRecords('Distance', {timeRangeFilter});
            const totalDistance = distance.reduce((sum, cur) => sum + cur.distance.inMeters, 0);
            setDistance(totalDistance);
        }

        getHealthData();
    }, [androidPermissions]);

    useEffect(() => {
        if (!hasAndroidPermissions('FloorsClimbed')) {
            return;
        }

        const getHealthData = async () => {
            const today = new Date();
            const timeRangeFilter: TimeRangeFilter = {
                operator: 'between',
                startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
                endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
            }

            // Steps
            const floorsClimbed = await readRecords('FloorsClimbed', {timeRangeFilter});
            const totalFloors = floorsClimbed.reduce((sum, cur) => sum + cur.floors, 0);
            setFlights(totalFloors);
        }

        getHealthData();
    }, [androidPermissions])
    

    return {steps, flights, distance};
}

export default useHealthData;