package com.tyn.app2;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.RemoteException;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.tyn.helloworld.IAppServiceRemoteBinder;
import com.tyn.helloworld.IRemoteCallBack;

public class ServiceActivity extends Activity implements View.OnClickListener, ServiceConnection {

    private boolean bindServiceRunning = false;
    private IAppServiceRemoteBinder binder = null;
    private EditText et = null;
    private TextView tvData = null;
    private Intent intentService=null;

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
        intentService=new Intent();
        intentService.setComponent(new ComponentName("com.tyn.helloworld","com.tyn.helloworld.RemoteService"));
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btnStartService:
                //调用者和服务之间没有联系，即使调用者退出了，服务依然在进行
                //传递参数
                intentService.putExtra("name", et.getText().toString());
                startService(intentService);
                break;
            case R.id.btnStopService:
                stopService(intentService);
                break;
            case R.id.btnBindService:
                //调用者和绑定者绑在一起，调用者一旦退出服务也就终止了
                bindServiceRunning = true;
                //this 实现了ServiceConnection
                bindService(intentService, this, Context.BIND_AUTO_CREATE);
                break;
            case R.id.btnUnbindService:
                if (bindServiceRunning) {
                    unbindService(this);
                    bindServiceRunning = false;
                }
                binder=null;
                break;
            case R.id.btnSyncData:
                if (binder != null) {
                    try {
                        binder.setData(et.getText().toString());
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
                break;
        }
    }

    @Override
    public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
        System.out.println("remote service connected!");
        binder = IAppServiceRemoteBinder.Stub.asInterface(iBinder);
        try {
            //注册一个aidl对象
            binder.register(new IRemoteCallBack.Stub() {
                @Override
                public void onDataChange(String data) throws RemoteException {
                                    //其它铺线程是不允许修改主线程的UI
                    Message msg = new Message();
                    Bundle bundle = new Bundle();
                    bundle.putString("data", data);
                    msg.setData(bundle);
                    handler.sendMessage(msg);
                }
            });
        } catch (RemoteException e) {
            e.printStackTrace();
        }
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
    @Override
    public void onServiceDisconnected(ComponentName componentName) {
        System.out.println("service disconnected!");
    }

}
