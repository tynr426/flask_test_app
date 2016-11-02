// IAppServiceRemoteBinder.aidl
package com.tyn.helloworld;
import com.tyn.helloworld.IRemoteCallBack;
// Declare any non-default types here with import statements
interface IAppServiceRemoteBinder {
    /**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
    void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat,
            double aDouble, String aString);
            void setData(String data);
            void register(IRemoteCallBack callback);
}
