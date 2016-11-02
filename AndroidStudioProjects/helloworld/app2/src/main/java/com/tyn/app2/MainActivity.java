package com.tyn.app2;

import android.content.Intent;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        findViewById(R.id.btnStartActivity).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i=new Intent(OtherActivity.ACTION, Uri.parse("app://hello"));
                startActivity(i);
            }
        });
        findViewById(R.id.btnStartApp).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i=new Intent(OtherActivity.APPACTION);
                i.putExtra("name", "app2传来的参数");
                startActivity(i);
            }
        });
        findViewById(R.id.btnRemoteService).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i=new Intent(MainActivity.this,ServiceActivity.class);
                startActivity(i);
            }
        });
        findViewById(R.id.btnCheckPermission).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i=new Intent("com.tyn.helloworld.intent.action.PermissionActivity");
                startActivity(i);
            }
        });
    }
}
