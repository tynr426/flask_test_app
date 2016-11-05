package com.tyn.helloworld;

import android.graphics.Camera;
import android.graphics.Matrix;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.Animation;
import android.view.animation.Transformation;

/**
 * Created by apple on 16/11/5.
 */
public class CustomAnimate extends Animation {
    private int halfWidth;

    private int halfHeight;
    /**
     * Camera就像一个摄像机，一个物体在原地不动，然后我们带着这个摄像机四处移动，
     * 在摄像机里面呈现出来的画面，就会有立体感，就可以从各个角度观看这个物体。
     */
    Camera camera = new Camera();

    @Override
    /**
     * 初始化,可以获取到目标控件及父控件的宽高
     */
    public void initialize(int width, int height, int parentWidth, int parentHeight) {
        super.initialize(width, height, parentWidth, parentHeight);
        halfWidth = (width) / 2;
        halfHeight = height / 2;
        setDuration(500);
        //如果setFillAfter置为true， 就会在移动动画结束的位置淡出
        //setFillAfter(true);
/*通过setInterpolator方法，可以给Animator设置插值器，
 默认的插值器是AccelerateDecelerateInterpolator，即加速减速插值器。
*/
        setInterpolator(new AccelerateDecelerateInterpolator());
    }

    @Override
    /**
     * 具体要执行的动画效果
     * interpolatedTime: 插值时间,也就是执行的百分比
     * t: 动画的目标对象
     */
    protected void applyTransformation(float interpolatedTime, Transformation t) {
        System.out.println(interpolatedTime);
        final Matrix matrix = t.getMatrix();
        //获取变换矩阵matrix，并对目标对象进行相应的变化（左右摇动动画）
//        matrix.getMatrix().setTranslate((float) (Math.sin(interpolatedTime * 10) * 100), 0);


        /*电视机关机效果*/
        tvAnimate(interpolatedTime, matrix);
        /*自定义图片旋转动画*/
//        definedAnimate(interpolatedTime, matrix);
        super.applyTransformation(interpolatedTime, t);
    }

    private void tvAnimate(float interpolatedTime, Matrix matrix) {
        if (interpolatedTime < 0.8) {
            matrix.preScale(1 + 0.625f * interpolatedTime,
                    1 - interpolatedTime / 0.8f + 0.01f, halfWidth, halfHeight);
        } else if (interpolatedTime < 1) {
            matrix.preScale(7.5f * (1 - interpolatedTime), 0.01f, halfWidth,
                    halfHeight);
        } else {
            matrix.preScale(interpolatedTime, halfWidth * 2, interpolatedTime, halfHeight * 2);
        }
    }

    /*自定义图片旋转动画*/
    private void definedAnimate(float interpolatedTime, Matrix matrix) {
        //保存状态,类似于canvas的save方法
        camera.save();

        //变换
        camera.translate(0.0f, 0.0f, (1300 - 1300.0f * interpolatedTime));
        camera.rotateY(360 * interpolatedTime);
        camera.getMatrix(matrix);
        matrix.preTranslate(-halfWidth, -halfHeight);
        matrix.postTranslate(halfWidth, halfHeight);
        //恢复状态
        camera.restore();
    }
}
