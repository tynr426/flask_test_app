package com.tyn.helloworld;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by apple on 16/8/26.
 */
public class UserEntity implements Parcelable {
    private String userName;
    private String nick;
    private String pwd;

    public String getUserName() {
        return userName;
    }

    public String getNick() {
        return nick;
    }

    public String getPwd() {
        return pwd;
    }
    public UserEntity(String _userName,String _pwd){
        this.userName=_userName;
        this.pwd=_pwd;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(getUserName());
        parcel.writeString(getPwd());
    }
    public  static  final Creator<UserEntity> CREATOR=new Creator<UserEntity>() {
        @Override
        public UserEntity createFromParcel(Parcel parcel) {
            return new UserEntity(parcel.readString(),parcel.readString());
        }

        @Override
        public UserEntity[] newArray(int i) {
            return new UserEntity[i];
        }
    };

}
