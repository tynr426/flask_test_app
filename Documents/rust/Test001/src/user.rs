struct User{
    user_name:String,
    pwd:String,
    email:String,
    sign_in_count:u64,
    active:bool
}
impl User{
    fn new(_user_name:String,_pwd:String)->User{
        User{user_name:_user_name,
        pwd:_pwd,
        active:true,
        email: String::from("someone@example.com"),
        sign_in_count:1
        }
    }
    fn login(&self)->(i32,&str){
        let mut status:i32=0;
        let mut msg="";
        if self.user_name!="zhangsan"
            {
                status=201;
                msg="用户名不正确";
            }
        if self.pwd!="111111"
            {
                status=201;
                msg="密码不正确";
            }
        else
            {
                // status=200;
                // msg="ok";
                return (200,&"ok");
            }
        (status,&msg)
    }
}