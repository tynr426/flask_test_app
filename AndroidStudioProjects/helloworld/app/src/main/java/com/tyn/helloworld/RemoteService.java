package com.tyn.helloworld;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
public class RemoteService extends Service {
    private boolean serviceRunning = false;
    private String data = "远程服务正在运行";
    private IRemoteCallBack callBack = null;

    public RemoteService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        return new IAppServiceRemoteBinder.Stub() {
            @Override
            public void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat, double aDouble, String aString) throws RemoteException {

            }

            @Override
            public void setData(String data) throws RemoteException {
                RemoteService.this.data=data;
            }
            @Override
           public void register(IRemoteCallBack callback) throws RemoteException{
               callBack=callback;
           }
        };
    }
    @Override
    public void onCreate() {
        super.onCreate();
        serviceRunning = true;
        System.out.println("remote service created");
        new Thread() {
            @Override
            public void run() {
                super.run();
                int i = 1;
                while (serviceRunning) {
                    String str = (i++) + data;
                    System.out.println(str);
                    if(callBack!=null)
                        try {
                            callBack.onDataChange(str);
                        } catch (RemoteException e) {
                            e.printStackTrace();
                        }
                    try {
                        sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }.start();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        System.out.println("remote service start");
        data = intent.getStringExtra("name");
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        System.out.println("remote service destroy");
        serviceRunning = false;
    }



}
