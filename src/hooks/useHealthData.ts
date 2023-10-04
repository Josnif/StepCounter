import { useEffect, useState } from "react";
import { Platform } from "react-native";
import AppleHealthKit, {
    HealthInputOptions,
    HealthKitPermissions,
    HealthUnit,
} from "react-native-health";

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


    }, [hasPermissions])


    return {steps, flights, distance};
}

export default useHealthData;