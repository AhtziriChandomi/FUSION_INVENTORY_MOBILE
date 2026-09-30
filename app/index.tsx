import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as SQLite from '../database/schema';
import { setIsConnected } from '../store/slices/appSlice';
import Login from './screens/Login';

export default function Index() {

    const dispatch = useDispatch();
    const {isConnected, forceOffline} = useSelector((state: any) => state.app);

    const [dbready, setDbReady] = useState(false);
    const [dbError, setDbError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const online =
            (state.isConnected ?? false) &&
            (state.isInternetReachable ?? true);

            dispatch(setIsConnected(online));
        });
        return () => unsubscribe();
    }, [dispatch]);


    useEffect(() => {
        let mount = true;

        (async () => {
            try{
                //crear la estructura (tablas) una sola vez al inicio
                await SQLite.CreateStructureBD();
                if(mount) setDbReady(true);
            } catch (e: any) {
                console.log('Db init error: ', e)
                if(mount){
                    setDbError(e?.message ?? 'DB init error');
                    setDbReady(true); //para que al menos puedas mostrar UI y el error
                }
            }
        })();

        return () => { mount = false; }
    }, []);

    if(!dbready){
        return <View style={{flex: 1}} /> //se puede poner un loader si se quiere
    }

    //return <Login isOfflineMode={isOfflineMode}/>

    return (
        <View style={{flex: 1}}>            
            <Login 
                dbError={dbError} //opcional para mostrar en el login
            />
        </View>
    )
}