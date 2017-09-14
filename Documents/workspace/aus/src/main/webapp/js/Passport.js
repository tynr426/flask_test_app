var user={	
		//弹出框
		openDialog:function(user1){
			var html=$("#userDialog").html();
			var obj=$("#AccountFormTemplate");
			obj.html(html);
			
			if(user1!=undefined){
				
				$(obj).find("#Id").val(user1.id);
				$(obj).find("#UserName").val(user1.userName);
				$(obj).find("#Password").val(user1.password);
				$(obj).find("#NickName").val(user1.nickName);
				$(obj).find("#Email").val(user1.email);
				$(obj).find("#Mobile").val(user1.mobile);
			}
			$("#AccountFormTemplate").dialog({
				autoOpen:false,
				height:400,
				width:500,
				model:true,
				buttons:{
					"确定":function(){
						if(user1!=undefined){
						user.updateUser(this);
						}else{							
							user.addUser(this);
						}
					},
					"取消":function(){
						$(this).dialog('close');
					}
				},
				Cancle:function(){
					$(this).dialog('close');
				}
			}).dialog('open');
			
		},
		//删除的弹出框
		openDeleteDialog:function(id){
			$("#AccountFormTemplate").html("是否确认删除！");
			$("#AccountFormTemplate").dialog({
				autoOpen:false,
				height:200,
				width:500,
				model:true,
				buttons:{
					"确定":function(){
						user.deleteUser(this,id);
					},
					"取消":function(){
						$(this).dialog('close');
					}
				},
				Cancle:function(){
					$(this).dialog('close');
				}
			}).dialog('open');
		},
		addUser:function(obj){
			var username = $("#UserName").val().trim();
			var password = $("#Password").val().trim();
			var nickname = $("#NickName").val().trim();
			var email = $("#Email").val().trim();
			var mobile = $("#Mobile").val().trim();
			var status = $("input[name=Status]:checked").val();
			$.ajax({
				url:path+"/user/regist.do",
				type:"post",
				data:{userName:username,password:password,nickName:nickname,email:email,mobile:mobile,status:status},
				dataType:"json",
				success:function(result){
					if(result.state==0){
						alert(result.data+"您已注册成功");
						$(obj).dialog('close');
						load();
					}else{	
						alert(result.message);		
					}								

				},
				error:function(){
					alert("添加失败");
				}
			});
		},
		//获取用户信息
		getUser:function(Id){
			$.ajax({
				url:path+"/user/getUser.do",
				type:"post",
				data:{Id:Id},
				dataType:"json",
				success:function(data){					
					if(data.state==0){
						user.openDialog(data.data);
					}
				},
				error:function(){
					alert("获取失败");
				}
			});
		},
		//修改用户信息
		updateUser:function(obj){
			var id = $("#AccountFormTemplate").find("#Id").val().trim();
			console.log(id);
			var nickname = $("#AccountFormTemplate").find("#NickName").val().trim();
			var email = $("#AccountFormTemplate").find("#Email").val().trim();
			var mobile = $("#AccountFormTemplate").find("#Mobile").val().trim();
			var status = $("#AccountFormTemplate").find("input[name=Status]:checked").val();
			$.ajax({
				url:path+"/user/update.do",
				type:"post",
				data:{Id:id,nickName:nickname,email:email,mobile:mobile,status:status},
				dataType:"json",
				success:function(data){
					if(data.state==0){
						load();
						$(obj).dialog('close');	
					}
				},
				error:function(){
					alert("修改失败");
				}
			});
		},
		//删除用户
		deleteUser:function(obj,id){		
			$.ajax({
				url:path+"/user/delete.do",
				type:"post",
				data:{Id:id},
				dataType:"json",
				success:function(result){
					if(result.state==0){
						alert("删除成功")
						load();
						$(obj).dialog('close');
					}			
				},
				error:function(){
					alert("删除失败");
				}
			});
		}
		
}