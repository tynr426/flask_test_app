#[macro_use]
use std::*;
include!("circle_d.rs");
include!("enum_c.rs");
include!("user.rs");
fn main() {

    // learn_arr();
    // learn_vec();
    // learn_yuanzu();
    fn_learn_str();
    learn_struct();
    let red=Color::Red;
    let blue: Color = Color::Blue;
    println!("blue:{};red:{}",blue as i32,red as i32);
     let mut c = Circle::new((0, 0), 3);
 
    println!("The circle’s area is {}", c.area());
    println!("The circles location is {:?}", c.center);
     
    c.rename_value((-1, 1));
     
    println!("The circles location is {:?}", c.center);
}
fn print_value(value: i32) {
    let y:&str="is it a wonderfull life";
    let x=String::from("hello;");
    println!("{} The value given was: {}{}", x,value,y);
}
fn learn_arr(){
    let x=[1,2,3];
    let y:[i32;3]=[4,5,6];
    let s:usize=y.len();
    print_value(s as i32);
}
fn learn_vec(){
    let x=vec![1,3,3];
    let mut y:Vec<i32>=[4, 5, 6].to_vec();
    //print_vec(y);
    print_vec2(&mut y);
    println!("{:?}",y);
}
// fn print_vec(v:Vec<i32>)->Vec<i32>{
//     //println!("I took this data{:?},and returned it",v)
//     //return v;
// }
fn print_vec2(v:&mut Vec<i32>){
    v.push(5);
}
fn learn_yuanzu(){

    let x = (5, '6');
    let y: i32 = x.0; // y == 5
    let z: char = x.1; // z == ‘6’
    println!("x={}",y)
}
fn learn_for(){
    
    let x = vec![0, 7, 2, 3, 4];
     for e in &x{
        print!("element:{}",e )
    }
    println!("");
    for e in x {
        print!("x: {}", e);
    }
   
}
fn fn_learn_str(){
    let mut s=String::from("hello world!");
    let s1="cctv and cdtv";
    let mut s2=s1.to_string();
    let r4=fist_world(&s2);
    //s.clear();
    println!("r4={}",r4);
}
fn fist_world(s:&str)-> &str{
    let byte_wold=s.as_bytes();
    for(i,&item)in byte_wold.iter().enumerate(){
        if(item==b' '){
            return &s[..i];
        }
    }
    return &s[..];
}
fn learn_struct(){
     let user= User::new("zhangsan".to_string(),"111111".to_string());
      let result=  user.login();
      println!("result={:?}",result);
}