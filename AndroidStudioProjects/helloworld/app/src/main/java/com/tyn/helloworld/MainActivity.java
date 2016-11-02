package com.tyn.helloworld;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.TextView;

public class MainActivity extends Activity {

    private TextView tvWelcome=null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //设置为自定义标题
        this.requestWindowFeature(Window.FEATURE_CUSTOM_TITLE);
        setContentView(R.layout.activity_main);
        this.getWindow().setFeatureInt(Window.FEATURE_CUSTOM_TITLE,R.layout.title);
        findViewById(R.id.startOtherAct).setOnClickListener(listener);
        findViewById(R.id.openWeb).setOnClickListener(listener);
        findViewById(R.id.openDialog).setOnClickListener(listener);
        findViewById(R.id.btLogin).setOnClickListener(listener);
        findViewById(R.id.btnLaunchMode).setOnClickListener(listener);
        findViewById(R.id.btnContext).setOnClickListener(listener);
        findViewById(R.id.btnService).setOnClickListener(listener);
        findViewById(R.id.btnReceiver).setOnClickListener(listener);
        findViewById(R.id.btnCheckPermission).setOnClickListener(listener);
        findViewById(R.id.btnRecyclerView).setOnClickListener(listener);
        findViewById(R.id.btnDefinedMenu).setOnClickListener(listener);
        findViewById(R.id.btnPageAdapter).setOnClickListener(listener);
        findViewById(R.id.btnDrawerLayout).setOnClickListener(listener);
        findViewById(R.id.btnDrawerLayout2).setOnClickListener(listener);
        tvWelcome=(TextView)findViewById(R.id.tbartxt);



    }

    //事件监听器
    private  View.OnClickListener listener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            switch (view.getId()) {
                case R.id.btLogin: //登录
                    startActivityForResult(new Intent(MainActivity.this, Login.class),1);
                    break;
                case R.id.openWeb://打开网页
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("http://m.plus31.366ec.net")));
                    break;
                case R.id.openDialog: //弹出框
                    startActivity(new Intent(MainActivity.this, DialogActivity.class));
                    break;
                case R.id.startOtherAct://启动另一个activity
                    Intent i = new Intent(MainActivity.this, OtherActivity.class);
                    i.putExtra("name", "zhangyudeng");
                    startActivity(i);
                    break;
                case  R.id.btnLaunchMode:
                    startActivity(new Intent(MainActivity.this,LaunchModeA.class));
                    break;
                case R.id.btnContext:
                    startActivity(new Intent(MainActivity.this,ImageActivity.class));
                    break;
                case  R.id.btnService:
                    startActivity(new Intent(MainActivity.this,ServiceActivity.class));
                    break;
                case R.id.btnReceiver:
                    startActivity(new Intent(MainActivity.this,ReceiverActivity.class));
                    break;
                case R.id.btnCheckPermission:
                    startActivity(new Intent(MainActivity.this,PermissionActivity.class));
                    break;
                case R.id.btnRecyclerView:
                    startActivity(new Intent(MainActivity.this,RecyclerViewActivity.class));
                    break;
                case R.id.btnDefinedMenu:
                    startActivity(new Intent(MainActivity.this,DefinedMenuActivity.class));
                case R.id.btnPageAdapter:
                    startActivity(new Intent(MainActivity.this,GuidActivity.class));
                case R.id.btnDrawerLayout:
                    startActivity(new Intent(MainActivity.this,DrawerLayout.class));
                case R.id.btnDrawerLayout2:
                    startActivity(new Intent(MainActivity.this,CustomListView.class));
            }
        }
    };

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //点击后退键时，data没人传递值
        if(data==null)return;
        //UserEntity user=data.getSerializableExtra("user");serializable序列化
        UserEntity user=data.getParcelableExtra("user");
        if(resultCode==1){

            tvWelcome.setText(String.format("%s，欢迎来到我们的网站",user.getUserName()));
        }
        else{
            tvWelcome.setText(String.format("%s,欢迎来到我们的网站,请登录",user.getUserName()));
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        System.out.println("a onStart");

    }

    @Override
    protected void onResume() {
        super.onResume();
        System.out.println("a onResume");
    }

    @Override
    protected void onPause() {
        super.onPause();
        System.out.println("a onPause");
    }

    @Override
    protected void onStop() {
        super.onStop();
        System.out.println("a onStop");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        System.out.println("a onDestroy");
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        System.out.println("a onRestart");
    }
}
