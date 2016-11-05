package com.tyn.helloworld;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.AnimationUtils;
import android.view.animation.LayoutAnimationController;
import android.view.animation.RotateAnimation;
import android.view.animation.ScaleAnimation;
import android.view.animation.TranslateAnimation;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.Toast;

public class AnimationPage extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_animation_page);

        //为布局添加动画
        CustomAnimate ca = new CustomAnimate();
        ca.setDuration(1000);
        LayoutAnimationController lc = new LayoutAnimationController(ca, 0.5f);
//        View root= getLayoutInflater().inflate(R.layout.activity_animation_page,null);
//        LinearLayout ll= (LinearLayout) root.findViewById(R.id.animationPage);
        //与上面两句等同，只要根节点为LinearLayout就可以
        LinearLayout ll = (LinearLayout) getLayoutInflater().inflate(R.layout.activity_animation_page, null);
        ll.setLayoutAnimation(lc);
        setContentView(ll);
        //为ListView设置布局动画(可使用xml布局，也可使用代码动画布局
//        Animation sa = AnimationUtils.loadAnimation(this,R.anim.sa);
//        LayoutAnimationController lc2 = new LayoutAnimationController(sa, 0.1f);
        ArrayAdapter<String> adpter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1,
                new String[]{"zhangsan", "lisi", "wangwu"});
        ListView lv = (ListView) findViewById(R.id.listView);
        lv.setAdapter(adpter);
        //lv.setLayoutAnimation(lc2);


        findViewById(R.id.btnAlph).setOnClickListener(listener);
        findViewById(R.id.btnRotate).setOnClickListener(listener);
        findViewById(R.id.btnTranslate).setOnClickListener(listener);
        findViewById(R.id.btnScale).setOnClickListener(listener);
        findViewById(R.id.btnAnimateSet).setOnClickListener(listener);
        findViewById(R.id.btnCustomAnimate).setOnClickListener(listener);


    }

    View.OnClickListener listener = new View.OnClickListener() {
        @Override
        public void onClick(final View view) {
            switch (view.getId()) {
                case R.id.btnAlph:
                    //透明度
//                    AlphaAnimation at=new AlphaAnimation(0,1);
//                    at.setDuration(1000);
//                    view.startAnimation(at);
                    //通过xml文件配置
                    view.startAnimation(AnimationUtils.loadAnimation(AnimationPage.this, R.anim.at));
                    break;
                case R.id.btnRotate:
                    //相对自身的百分比进行旋转
//                    RotateAnimation ra=new RotateAnimation(0,360,
//                            Animation.RELATIVE_TO_SELF,0.5f,
//                            Animation.RELATIVE_TO_SELF,0.5f);
//                    ra.setDuration(1000);
                    //通过xml文件配置
                    view.startAnimation(AnimationUtils.loadAnimation(AnimationPage.this, R.anim.ra));
                case R.id.btnTranslate:
                    //相对自身移动增量
//                    TranslateAnimation ta=new TranslateAnimation(0,200,0,200);
//                    ta.setDuration(1000);
//                    view.startAnimation(ta);
                    //通过xml文件配置
                    view.startAnimation(AnimationUtils.loadAnimation(AnimationPage.this, R.anim.ta));
                    break;
                case R.id.btnScale:
                    //相对自身进行缩放
//                    ScaleAnimation sa=new ScaleAnimation(0,10,0,10,Animation.RELATIVE_TO_SELF,0.5f,Animation.RELATIVE_TO_SELF,0.5f);
//                    sa.setDuration(1000);
//                    view.startAnimation(sa);
                    //通过xml文件配置
                    view.startAnimation(AnimationUtils.loadAnimation(AnimationPage.this, R.anim.sa));
                    break;
                case R.id.btnAnimateSet:
                    //混合动画（添加多种动画)
//                    view.startAnimation(addAnimate());
                    //通过xml文件配置
                    Animation as = AnimationUtils.loadAnimation(AnimationPage.this, R.anim.as);
                    //动画事件侦听
                    as.setAnimationListener(new Animation.AnimationListener() {
                        @Override
                        public void onAnimationStart(Animation animation) {
                            view.setAlpha(1);
                        }

                        @Override
                        public void onAnimationEnd(Animation animation) {
                            Toast.makeText(AnimationPage.this, "结束", Toast.LENGTH_LONG).show();
                        }

                        @Override
                        public void onAnimationRepeat(Animation animation) {

                        }
                    });
                    view.startAnimation(as);
                    break;
                case R.id.btnCustomAnimate:
                    //自定义动画
                    CustomAnimate ca = new CustomAnimate();
                    ca.setDuration(1000);
                    view.startAnimation(ca);
                    break;
            }
        }
    };

    //通过代码添加混合动画
    private AnimationSet addAnimate() {
        AnimationSet as = new AnimationSet(true);
        as.setDuration(1000);
        ScaleAnimation sa = new ScaleAnimation(0, 10, 0, 10, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        as.addAnimation(sa);
        RotateAnimation ra = new RotateAnimation(0, 360,
                Animation.RELATIVE_TO_SELF, 0.5f,
                Animation.RELATIVE_TO_SELF, 0.5f);
        as.addAnimation(ra);
        return as;
    }
}
