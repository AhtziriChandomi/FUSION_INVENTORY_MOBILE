import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsConnected } from "../store/slices/appSlice";

export default function NetworkListener() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubcribe = NetInfo.addEventListener(state => {
            dispatch(setIsConnected(state.isConnected ?? false));
        });

        return () => unsubcribe();
    }, []);

    return null; 
}