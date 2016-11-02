// RemoteCallBack.aidl
package com.tyn.helloworld;

// Declare any non-default types here with import statements

interface IRemoteCallBack {
    /**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
    void onDataChange(String data);
}
