package com.tyn.helloworld;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

public class Login extends AppCompatActivity {

    private EditText etUserName = null;
    private EditText etPwd = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        getWindow().setTitle("欢迎登录！");
        etUserName = (EditText) findViewById(R.id.etUserName);
        etPwd = (EditText) findViewById(R.id.etPWD);
        findViewById(R.id.btLogin).setOnClickListener(listener);
        findViewById(R.id.btnLoginOut).setOnClickListener(listener);
    }

    View.OnClickListener listener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            switch (view.getId()) {
                case R.id.btLogin:
                    String username = "游客", pwd = "111111";
                    int status = 0;
                    if (etUserName != null && etPwd != null) {
                        username = etUserName.getText().toString();
                        pwd = etPwd.getText().toString();

                        if (username.equals("zhangyudeng") && pwd.equals("111111")) {
                            status = 1;
                            Toast.makeText(Login.this, "登录成功", Toast.LENGTH_LONG);
                        }
                    }
                    UserEntity user = new UserEntity(username, pwd);
                    Intent i = new Intent(Login.this, MainActivity.class);
                    i.putExtra("user", user);
                    setResult(status, i);
                    finish();
                    break;
            }
        }
    };

}
