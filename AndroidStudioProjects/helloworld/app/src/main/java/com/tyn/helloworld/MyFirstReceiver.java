package com.tyn.helloworld;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class MyFirstReceiver extends BroadcastReceiver {
    public static  String ACTION="com.tyn.helloworld.MyFirstReceiver";
    private String data = "接受器正在运行";
    public MyFirstReceiver() {

    }

    @Override
    public void onReceive(Context context, Intent intent) {
        data=intent.getStringExtra("name");
        System.out.println("接受到了通知,接受到的数据："+data);
    }
}
