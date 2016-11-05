package com.tyn.helloworld;

import android.content.Context;
import android.support.v4.view.PagerAdapter;
import android.view.View;
import android.view.ViewGroup;

import java.util.List;

/**
 * Created by apple on 16/9/7.
 * PagerAdapter就是ViewPager提供的一个适配器，方便我们对各个View进行控制
 * 它是实现左右两个屏幕平滑地切换的一个类
 */
public class CustomPageAdapter extends PagerAdapter {
    private List<View> views;
    private Context context;
    public CustomPageAdapter(List<View> views, Context context){
        this.views=views;
        this.context=context;
    }
    //删除页卡
    @Override
    public void destroyItem(ViewGroup container, int position, Object object) {
        container.removeView(views.get(position));
    }
    //这个方法用来实例化页卡
    @Override
    public Object instantiateItem(ViewGroup container, int position) {
        container.addView(views.get(position));
        return views.get(position);
    }

    @Override
    public int getCount() {
        return views.size();
    }

    @Override
    public boolean isViewFromObject(View view, Object object) {
        return view==object;//官方提示这样写
    }
}
