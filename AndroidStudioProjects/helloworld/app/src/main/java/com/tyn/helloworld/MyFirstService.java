package com.tyn.helloworld;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;

import java.util.Timer;
import java.util.TimerTask;

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

    private int i = 0;

    @Override
    public void onCreate() {
        super.onCreate();
        startTimer();
        serviceRunning = true;
//        System.out.println("service created");
//        new Thread() {
//            @Override
//            public void run() {
//                super.run();
//                // int i = 1;
//                while (serviceRunning) {
//                    anynExcute();
//                    try {
//                        sleep(1000);
//                    } catch (InterruptedException e) {
//                        e.printStackTrace();
//                    }
//                }
//            }
//
//
//        }.start();
    }
    private void anynExcute() {
        String str = (i++) + data;

        if (callBack != null)
            callBack.onDataChange(str);

    }
    private Timer timer;
    private TimerTask timerTask;

    public void startTimer() {
        if (timer == null) {
            timer = new Timer();
            timerTask = new TimerTask() {
                @Override
                public void run() {
                    anynExcute();
                }
            };
            timer.schedule(timerTask, 1000, 1000);

        }
    }

    public void stopTimer() {
        if (timer != null) {
            timer.cancel();
            timerTask.cancel();
            timerTask = null;
            timer = null;
        }
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
        stopTimer();
    }

}
