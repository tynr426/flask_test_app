package com.tyn.helloworld;


import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.Button;
import android.view.View;
import android.widget.Toast;

import java.io.File;

public class OtherActivity extends AppCompatActivity {
    private ImageView imageView=null;
    private Button previous=null;//上一张
    private Button next=null;//下一张
    private int currentImgId=0;//记录当前ImageView显示的图片id
    int [] imgId = {   //ImageView显示的图片数组
            R.drawable.activity,
            R.drawable.p1,
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_other);
        imageView=(ImageView)findViewById(R.id.imageView);
        previous=(Button)findViewById(R.id.previous);
        next=(Button)findViewById(R.id.next);
        previous.setOnClickListener(listener);
        next.setOnClickListener(listener);
        //获取上一个activity传参值
        Intent i=getIntent();
        Toast.makeText(this, "上一个页面传递的参数值:"+i.getStringExtra("name"), Toast.LENGTH_LONG)
                .show();
    }
    private View.OnClickListener listener = new View.OnClickListener() {
        public void onClick(View v) {
            if (v == previous) {
                currentImgId = (currentImgId - 1 + imgId.length) % imgId.length;
                imageView.setImageResource(imgId[currentImgId]);//不会变形
                //imageView.setImageDrawable(getResources().getDrawable(imgId[currentImgId])); //不会变形
                String path= Environment.getExternalStorageDirectory()+ File.separator+"activity.png";
                Bitmap bm = BitmapFactory.decodeFile(path);
                //imageView.setImageBitmap(bm);//不会变形

            }
            if (v == next) {
                currentImgId = (currentImgId + 1) % imgId.length;
                imageView.setImageResource(imgId[currentImgId]);
            }
        }
    };

    @Override
    protected void onStart() {
        super.onStart();
        System.out.println("b onStart");

    }

    @Override
    protected void onResume() {
        super.onResume();
        System.out.println("b onResume");
    }

    @Override
    protected void onPause() {
        super.onPause();
        System.out.println("b onPause");
    }

    @Override
    protected void onStop() {
        super.onStop();
        System.out.println("b onStop");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        System.out.println("b onDestroy");
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        System.out.println("b onRestart");
    }
}
