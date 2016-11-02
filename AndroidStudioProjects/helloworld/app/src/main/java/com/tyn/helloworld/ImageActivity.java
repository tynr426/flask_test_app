package com.tyn.helloworld;

import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;

/**
 * Created by apple on 16/8/28.
 */
public class ImageActivity extends Activity {
    float currentDistance = -1;
    float lastDistance = -1;
    ImageView imageView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // TODO 动态添加布局(java方式)
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        LinearLayout view = new LinearLayout(this);
        view.setLayoutParams(lp);
        view.setOrientation(LinearLayout.HORIZONTAL);
        //定义子View中两个元素的布局
        ViewGroup.LayoutParams vlp = new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        ViewGroup.LayoutParams vlp2 = new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);

        imageView = new ImageView(this);
        imageView.setImageResource(R.mipmap.ic_launcher);
        imageView.setLayoutParams(vlp);
        view.addView(imageView);
        TextView textView = new TextView(this);
        textView.setText(R.string.personl_center_title);
        textView.setLayoutParams(vlp2);
        view.addView(textView);
        setContentView(view);
        //为application设置共享值
        ((App) getApplicationContext()).setName("动态布局");
        view.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch (motionEvent.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        System.out.println("action down");
                        break;
                    case MotionEvent.ACTION_MOVE:
                        if(motionEvent.getPointerCount()<3){
                            return false;
                        }
                        float offsetX = motionEvent.getX(0);
                        float offsetY = motionEvent.getY(0);
                        currentDistance = (float) Math.sqrt(offsetX * offsetX + offsetY * offsetY);
                        if (lastDistance < 0) {
                            lastDistance = currentDistance;
                        } else {
                            if (currentDistance - lastDistance > 5) {
                                System.out.println("放大");
                                LinearLayout.LayoutParams lp = (LayoutParams) view.getLayoutParams();
                                lp.width = (int) 1.1f * imageView.getWidth();
                                lp.height = (int) 1.1 * imageView.getHeight();
                                imageView.setLayoutParams(lp);
                                lastDistance=currentDistance;
                                /**/
                            } else {
                                System.out.println("缩小");
                                LinearLayout.LayoutParams lp = (LayoutParams) view.getLayoutParams();
                                lp.width = (int) 0.9f * imageView.getWidth();
                                lp.height = (int) 0.9 * imageView.getHeight();
                                imageView.setLayoutParams(lp);
                                lastDistance=currentDistance;
                            }
                        }
                        System.out.println("action move");
                        break;
                    case MotionEvent.ACTION_UP:
                        System.out.println("action up");
                        break;
                }
                return false;
            }
        });
    }
}
