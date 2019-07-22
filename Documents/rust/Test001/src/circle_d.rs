struct Circle {
    center: (i32, i32),
    radius: u32,
}
impl Circle{
    fn new(_center:(i32,i32),_radius:u32)->Circle{
        Circle{
            center:_center,
            radius:_radius
        }
    }
    fn area(&self)->f64{
        let f_radius=self.radius as f64;
        f_radius*f_radius*3.14159
    }
    fn rename_value(&mut self,new_center:(i32,i32)){
        self.center=new_center
    }
}