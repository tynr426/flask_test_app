package com.tyn.helloworld;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;

public class MyFirstService extends Service {
    private boolean serviceRunning = false;
    private String data = "服务正在运行";


    public MyFirstService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        return new MyBinder();
    }

    public class MyBinder extends Binder {
        public void setData(String data) {

            MyFirstService.this.data = data;
        }

        public void setCallBack(MyCallBack _callBack) {
            callBack = _callBack;
        }
    }

    private MyCallBack callBack = null;

    //回调接口
    public interface MyCallBack {
        void onDataChange(String data);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        serviceRunning = true;
        System.out.println("service created");
        new Thread() {
            @Override
            public void run() {
                super.run();
                int i = 1;
                while (serviceRunning) {
                    String str = (i++) + data;

                    if (callBack != null)
                        callBack.onDataChange(str);
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
        System.out.println("service start");
        data = intent.getStringExtra("name");
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        System.out.println("service destroy");
        serviceRunning = false;
    }

}
