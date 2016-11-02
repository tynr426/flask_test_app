package com.tyn.helloworld;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by apple on 16/9/7.
 * 引导页
 */
public class GuidActivity extends Activity implements ViewPager.OnPageChangeListener {
    private ViewPager vp;
    private ViewPageAdapter viewPageAdapter;
    private List<View> views;
    private ImageView[] droits;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_guid);
        initView();
        initDroits();
    }

    /*初始化选项卡*/
    private void initView() {
        LayoutInflater layoutInflater = LayoutInflater.from(this);
        views = new ArrayList<>();

        views.add(layoutInflater.inflate(R.layout.tab1, null));
        views.add(layoutInflater.inflate(R.layout.tab2, null));
        views.add(layoutInflater.inflate(R.layout.tab3, null));
        viewPageAdapter = new ViewPageAdapter(views, this);
        vp = (ViewPager) findViewById(R.id.viewPager);
        vp.setAdapter(viewPageAdapter);
        vp.addOnPageChangeListener(this);
        //监听最后一个选项卡button事件
        views.get(views.size() - 1).findViewById(R.id.btnGoTo).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(GuidActivity.this, ImageActivity.class);
                startActivity(i);
                finish();
            }
        });

    }

    /*初始化点集合*/
    private void initDroits() {
        droits = new ImageView[views.size()];
        ViewGroup.LayoutParams vlp = new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        LinearLayout linearLayout = (LinearLayout) findViewById(R.id.droits);
        for (int i = 0; i < views.size(); i++) {
            ImageView imageView = new ImageView(this);
            if (i == 0) {
                imageView.setImageResource(R.drawable.page_indicator_focused);
            } else {
                imageView.setImageResource(R.drawable.page_indicator_unfocused);
            }
            imageView.setLayoutParams(vlp);
            droits[i] = (imageView);
            linearLayout.addView(imageView);
        }
    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

    }

    @Override
    public void onPageSelected(int position) {
        for (int i = 0; i < droits.length; i++) {
            if (position == i) {

                droits[i].setImageResource(R.drawable.page_indicator_focused);
            } else {
                droits[i].setImageResource(R.drawable.page_indicator_unfocused);
            }
        }
    }

    @Override
    public void onPageScrollStateChanged(int state) {

    }
}
