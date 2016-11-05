package com.tyn.helloworld;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Point;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.animation.DecelerateInterpolator;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.Scroller;

/**
 * Created by apple on 16/9/6.
 * 自定义左右菜单
 */
public class DefinedMenu extends RelativeLayout {
    private Context context;
    private FrameLayout leftMenu;
    private FrameLayout midMenu;
    private FrameLayout rightMenu;
    private FrameLayout midMask;
    private Scroller scroller;
    public static int  LEFT_ID=0Xaabbcc;
    public static int MID_ID=0xaaccbb;
    public static int RIGHT_ID=0xccaabb;

    public DefinedMenu(Context context) {
        super(context);
        initView(context);
    }

    public DefinedMenu(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        initView(context);
    }

    private void initView(Context context) {
        this.context = context;
        scroller = new Scroller(context, new DecelerateInterpolator());
        leftMenu = new FrameLayout(context);
        midMenu = new FrameLayout(context);
        midMask =new FrameLayout(context);
        rightMenu = new FrameLayout(context);
        leftMenu.setBackgroundColor(Color.RED);
        midMenu.setBackgroundColor(Color.GREEN);
        rightMenu.setBackgroundColor(Color.YELLOW);
        midMask.setBackgroundColor(0x88000000);
        leftMenu.setId(LEFT_ID);
        midMenu.setId(MID_ID);
        rightMenu.setId(RIGHT_ID);
        addView(leftMenu);
        addView(midMenu);
        addView(rightMenu);
        addView(midMask);
        midMask.setAlpha(0);
    }

    @Override
    public void scrollTo(int x, int y) {
        super.scrollTo(x, y);
        int curX=Math.abs(getScrollX());
        float scale=curX/(float)leftMenu.getMeasuredWidth();
        System.out.println("scale="+scale);
        midMask.setAlpha(scale);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        midMenu.measure(widthMeasureSpec, heightMeasureSpec);
        midMask.measure(widthMeasureSpec, heightMeasureSpec);
        int realWidth = MeasureSpec.getSize(widthMeasureSpec);
        int tempWidth = MeasureSpec.makeMeasureSpec((int) (realWidth * 0.8), MeasureSpec.EXACTLY);
        leftMenu.measure(tempWidth, heightMeasureSpec);
        rightMenu.measure(tempWidth, heightMeasureSpec);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        super.onLayout(changed, l, t, r, b);
        midMenu.layout(l, t, r, b);
        midMask.layout(l,t,r,b);
        leftMenu.layout(l - leftMenu.getMeasuredWidth(), t, r, b);
        rightMenu.layout(l + midMenu.getMeasuredWidth(), t, l + midMenu.getMeasuredWidth() + rightMenu.getMeasuredWidth(), b);

    }

    private Point point = new Point();
    private static int DISTANCE = 20;
    private int scrollDirection = 0;

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (scrollDirection == 0) {
            GetScrollDirection(ev);
            return true;
        }
        if (scrollDirection == 1) {
            switch (ev.getActionMasked()) {
                case MotionEvent.ACTION_MOVE:
                    int curScollX = getScrollX();
                    int dis_x = (int) (ev.getX() - point.x);
                    int expectX = -dis_x + curScollX;
                    int finalX = 0;
                    if (expectX < 0) {
                        //向在滑动
                        finalX = Math.max(expectX, -leftMenu.getMeasuredWidth());
                    } else {
                        //向右滑动
                        finalX = Math.min(expectX, rightMenu.getMeasuredWidth());
                    }
                    scrollTo(finalX, 0);
                    point.x = (int) ev.getX();
                    break;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_CANCEL:
                    curScollX = getScrollX();
                    if (Math.abs(curScollX) > leftMenu.getMeasuredWidth() >> 1) {
                        if (curScollX < 0) {
                            scroller.startScroll(curScollX, 0, -leftMenu.getMeasuredWidth() - curScollX, 0);
                        } else {
                            scroller.startScroll(curScollX, 0, rightMenu.getMeasuredWidth() - curScollX, 0);
                        }
                    }
                    else{
                        scroller.startScroll(curScollX,0,-curScollX,0);
                    }
                    invalidate();
                    scrollDirection = 0;
                    break;
            }
        } else if (scrollDirection == 2) {
            switch (ev.getActionMasked()) {
                case MotionEvent.ACTION_UP:
                    scrollDirection = 0;
                    break;
            }
        }

        return super.dispatchTouchEvent(ev);
    }

    @Override
    public void computeScroll() {
        super.computeScroll();
        if(!scroller.computeScrollOffset()){
            return;
        }
        int tempX=scroller.getCurrX();
        scrollTo(tempX,0);
    }

    /*
        * 确定滑动方向
        * */
    private void GetScrollDirection(MotionEvent ev) {
        switch (ev.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                point.x = (int) ev.getX();
                point.y = (int) ev.getY();
                super.dispatchTouchEvent(ev);
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                scrollDirection=0;
                super.dispatchTouchEvent(ev);
                break;
            case MotionEvent.ACTION_MOVE:
                int dx = Math.abs((int) ev.getX() - point.x);
                int dy = Math.abs((int) ev.getY() - point.y);
                if (dx >= DISTANCE && dx > dy) {
                    //左右滑动
                    scrollDirection = 1;
                    point.x = (int) ev.getX();
                    point.y = (int) ev.getY();
                } else if (dy >= DISTANCE && dy > dx) {
                    //上下滑动
                    scrollDirection = 2;
                    point.x = (int) ev.getX();
                    point.y = (int) ev.getY();
                }
                break;
        }
    }
}
