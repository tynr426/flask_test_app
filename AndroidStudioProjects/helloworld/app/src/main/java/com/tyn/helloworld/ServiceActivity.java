package com.tyn.helloworld;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class ServiceActivity extends Activity implements View.OnClickListener, ServiceConnection {

    private boolean bindServiceRunning = false;
    private MyFirstService.MyBinder binder = null;
    private EditText et = null;
    private TextView tvData = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_service);
        et = (EditText) findViewById(R.id.et);
        tvData = (TextView) findViewById(R.id.tvData);
        findViewById(R.id.btnStartService).setOnClickListener(this);
        findViewById(R.id.btnStopService).setOnClickListener(this);
        findViewById(R.id.btnBindService).setOnClickListener(this);
        findViewById(R.id.btnUnbindService).setOnClickListener(this);
        findViewById(R.id.btnSyncData).setOnClickListener(this);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btnStartService:
                //调用者和服务之间没有联系，即使调用者退出了，服务依然在进行
                Intent i = new Intent(ServiceActivity.this, MyFirstService.class);
                //传递参数
                i.putExtra("name", et.getText().toString());
                startService(i);
                break;
            case R.id.btnStopService:
                stopService(new Intent(ServiceActivity.this, MyFirstService.class));
                break;
            case R.id.btnBindService:
                //调用者和绑定者绑在一起，调用者一旦退出服务也就终止了
                bindServiceRunning = true;
                //this 实现了ServiceConnection
                bindService(new Intent(ServiceActivity.this, MyFirstService.class), this, Context.BIND_AUTO_CREATE);
                break;
            case R.id.btnUnbindService:
                if (bindServiceRunning) {
                    unbindService(this);
                    bindServiceRunning = false;
                }
                break;
            case R.id.btnSyncData:
                if (binder != null) {
                    binder.setData(et.getText().toString());
                }
                break;
        }
    }

    @Override
    public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
        System.out.println("service connected!");
        binder = (MyFirstService.MyBinder) iBinder;
        binder.setCallBack(new MyFirstService.MyCallBack() {
            @Override
            public void onDataChange(String data) {
                //其它铺线程是不允许修改主线程的UI
                Message msg = new Message();
                Bundle bundle = new Bundle();
                bundle.putString("data", data);
                msg.setData(bundle);
                handler.sendMessage(msg);
            }
        });
    }

    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            String str = msg.getData().getString("data");
            System.out.println(str);
            tvData.setText(str);

        }
    };
    private Runnable runnable=new Runnable() {
        @Override
        public void run() {

        }
    };

    @Override
    public void onServiceDisconnected(ComponentName componentName) {
        System.out.println("service disconnected!");
    }

}
