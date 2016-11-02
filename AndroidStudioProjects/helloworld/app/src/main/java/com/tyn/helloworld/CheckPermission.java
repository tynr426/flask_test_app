package com.tyn.helloworld;

import android.content.Context;
import android.content.pm.PackageManager;

/**
 * Created by apple on 16/9/1.
 */
public class CheckPermission {
    public static String PERMISSION_CHECK = "com.tyn.helloworld.permission.check";

    public static void check(Context context) {
        if (context.checkCallingOrSelfPermission(PERMISSION_CHECK) != PackageManager.PERMISSION_GRANTED) {
            throw new SecurityException("执行check方法没权限");

        }
        System.out.println("权限检测");
    }
}
