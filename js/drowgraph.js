    
    window.onload=function(){
        selectGraphType();
        //自动触发画笔
        $("#drowWrite").trigger("click");
    }
    
//=============================初始化============================
    function initAll(){
        //存放起点坐标
        axis_begin_json={};
        axis_move_json={};
        //存放历史坐标
        axis_last=[];
        tag_line=-1;
        tag_rect=-1;
        tag_tri=-1;
        tag_circle=-1;
        //写字历史坐标
        axis_write_last=[];
        //存放写字过程中起点坐标
        write_start_point=[];
        tag_write=-1;
        //橡皮擦历史坐标
        axis_rubber_last=[];
        tag_rubber=-1;
        //过渡存放
        axis_start_last=[];
        axis_end_last=[];
        //设置画笔默认大小与颜色
        brush_size_gobal=3;
        brush_color_gobal="#000000";
        //删除上一步坐标存放
        delete_axis=[];
    }

//=============================图形选择===========================
    function selectGraphType(){
        initAll();
        //说明点击哪一部分
        var action_type="";
        
        /**触发画笔写字 */
        var write_point=document.getElementById("drowWrite");
        write_point.onclick=function(event){
            action_type="write";
            $("#selectBrushSize").hide();
            $("#selectBrushColor").hide();
            $(this).removeClass("layui-btn-primary");
            $("#drowTypeBtn").addClass("layui-btn-primary");
            $("#brushSize").addClass("layui-btn-primary");
            $("#brushColor").addClass("layui-btn-primary");
            $("#rubberPicture").addClass("layui-btn-primary");
            $("#prevDrowStep").addClass("layui-btn-primary");
            $("#nextDrowStep").addClass("layui-btn-primary");
            $("#cleanAllDrow").addClass("layui-btn-primary");
            //颜色选择图标显示
            var drowTypeItem=document.getElementById("allGraphTypeShow");
            drowTypeItem.style.display="none";
            var targetId=event.target.id;
            drowPicture(action_type,targetId);
        }
    
        /**触发图形点击 */
        var drowTypeDiv=document.getElementById("drowGraphDiv");
        drowTypeDiv.onclick=function(event){
            action_type="drow";
            
            //颜色选择图标显示
            $("#selectBrushSize").hide();
            $("#selectBrushColor").hide();
            $("#allGraphTypeShow").fadeToggle();
            $("#drowTypeBtn").removeClass("layui-btn-primary");
            $("#drowWrite").addClass("layui-btn-primary");
            $("#brushSize").addClass("layui-btn-primary");
            $("#brushColor").addClass("layui-btn-primary");
            $("#rubberPicture").addClass("layui-btn-primary");
            $("#prevDrowStep").addClass("layui-btn-primary");
            $("#nextDrowStep").addClass("layui-btn-primary");
            $("#cleanAllDrow").addClass("layui-btn-primary");
            var drowTypeItem=document.getElementById("allGraphTypeShow");
            drowTypeItem.onclick=function(event){
                var targetId=event.target.id;
                drowPicture(action_type,targetId);
                //$("#allGraphTypeShow").hide();
            }
        }

        /**触发改变画笔大小 */
        var brush_size=document.getElementById("brushSize");
        brush_size.onclick=function(event){
            action_type="size";
            $("#selectBrushSize").fadeIn();
            $("#selectBrushColor").hide();
            $("#allGraphTypeShow").hide();
            $(this).removeClass("layui-btn-primary");
            $("#drowWrite").addClass("layui-btn-primary");
            $("#drowTypeBtn").addClass("layui-btn-primary");
            $("#brushColor").addClass("layui-btn-primary");
            $("#rubberPicture").addClass("layui-btn-primary");
            $("#prevDrowStep").addClass("layui-btn-primary");
            $("#nextDrowStep").addClass("layui-btn-primary");
            $("#cleanAllDrow").addClass("layui-btn-primary");
            $("#selectBrushSize").on("click",function(event){
                var targetId=event.target.id;
                drowPicture(action_type,targetId);
            });
        }
    
        /**触发改变画笔颜色 */
        var brush_color=document.getElementById("brushColor");
        brush_color.onclick=function(){
            action_type="color";
            $("#selectBrushSize").hide();
            $("#selectBrushColor").fadeIn();
            $("#allGraphTypeShow").hide();
            $(this).removeClass("layui-btn-primary");
            $("#drowWrite").addClass("layui-btn-primary");
            $("#drowTypeBtn").addClass("layui-btn-primary");
            $("#brushSize").addClass("layui-btn-primary");
            $("#rubberPicture").addClass("layui-btn-primary");
            $("#prevDrowStep").addClass("layui-btn-primary");
            $("#nextDrowStep").addClass("layui-btn-primary");
            $("#cleanAllDrow").addClass("layui-btn-primary");
            $("#selectBrushColor").on("click",function(event){
                var targetId=event.target.id;
                drowPicture(action_type,targetId);
            });
        }
    
        /**触发橡皮擦功能 */
        var rubber_picture=document.getElementById("rubberPicture");
        rubber_picture.onclick=function(event){
            $("#selectBrushSize").hide();
            $("#selectBrushColor").hide();
            $("#allGraphTypeShow").hide();
            $(this).removeClass("layui-btn-primary");
            $("#drowWrite").addClass("layui-btn-primary");
            $("#drowTypeBtn").addClass("layui-btn-primary");
            $("#brushSize").addClass("layui-btn-primary");
            $("#brushColor").addClass("layui-btn-primary");
            $("#prevDrowStep").addClass("layui-btn-primary");
            $("#nextDrowStep").addClass("layui-btn-primary");
            $("#cleanAllDrow").addClass("layui-btn-primary");
            action_type="rubber";
            drowPicture(action_type,"rubber");
        }
    
        /**触发上一步 */
       var prev_step=document.getElementById("prevDrowStep");
        prev_step.onclick=function(){
            action_type="prev";
            $("#selectBrushSize").hide();
            $("#selectBrushColor").hide();
            $("#allGraphTypeShow").hide();
            $(this).removeClass("layui-btn-primary");
            $("#drowWrite").addClass("layui-btn-primary");
            $("#drowTypeBtn").addClass("layui-btn-primary");
            $("#brushSize").addClass("layui-btn-primary");
            $("#brushColor").addClass("layui-btn-primary");
            $("#rubberPicture").addClass("layui-btn-primary");
            $("#nextDrowStep").addClass("layui-btn-primary");
            $("#cleanAllDrow").addClass("layui-btn-primary");
            if(axis_last!=[]){
                var current_delete_arr=axis_last.pop();
                delete_axis.push(current_delete_arr);
                var canvasContent=document.getElementById("canvasShowPicture");
                var content=canvasContent.getContext("2d");
                cleanAllPicture(canvasContent,content);
                historyDrow(content);
            }
        }
    
        /**触发下一步 */
        var next_step=document.getElementById("nextDrowStep");
        next_step.onclick=function(){
            action_type="next";
            $("#selectBrushSize").hide();
            $("#selectBrushColor").hide();
            $("#allGraphTypeShow").hide();
            $(this).removeClass("layui-btn-primary");
            $("#drowWrite").addClass("layui-btn-primary");
            $("#drowTypeBtn").addClass("layui-btn-primary");
            $("#brushSize").addClass("layui-btn-primary");
            $("#brushColor").addClass("layui-btn-primary");
            $("#rubberPicture").addClass("layui-btn-primary");
            $("#prevDrowStep").addClass("layui-btn-primary");
            $("#cleanAllDrow").addClass("layui-btn-primary");
            if(delete_axis!=[]){
                var delete_axis_item=delete_axis.pop();
                axis_last.push(delete_axis_item);
                var canvasContent=document.getElementById("canvasShowPicture");
                var content=canvasContent.getContext("2d");
                cleanAllPicture(canvasContent,content);
                historyDrow(content);
            }
            
        }
    
        /**触发清除全部功能 */
        var clean_all=document.getElementById("cleanAllDrow");
        clean_all.onclick=function(event){
            $("#selectBrushSize").hide();
            $("#selectBrushColor").hide();
            $("#allGraphTypeShow").hide();
            $(this).removeClass("layui-btn-primary");
            $("#drowWrite").addClass("layui-btn-primary");
            $("#drowTypeBtn").addClass("layui-btn-primary");
            $("#brushSize").addClass("layui-btn-primary");
            $("#brushColor").addClass("layui-btn-primary");
            $("#rubberPicture").addClass("layui-btn-primary");
            $("#prevDrowStep").addClass("layui-btn-primary");
            $("#nextDrowStep").addClass("layui-btn-primary");
            action_type="cleanAll";
            drowPicture(action_type,"cleanAll");
        }
    
    }

//============================获得上下文===========================

    function drowPicture(action_type,id){
        var canvasContent=document.getElementById("canvasShowPicture");
        var content=canvasContent.getContext("2d");
        content.fillStyle = 'rgba(255, 255, 255, 0)';
        if(action_type=="size"){
            switch (id){
                case "lineWith_4":  content.lineWidth=4; brush_size_gobal=4; content.strokeStyle=brush_color_gobal; break;
                case "lineWith_6":  content.lineWidth=6; brush_size_gobal=6; content.strokeStyle=brush_color_gobal; break;
                case "lineWith_10":  content.lineWidth=10; brush_size_gobal=10; content.strokeStyle=brush_color_gobal; break;
            }
        }
        if(action_type=="color"){
            switch (id){
                case "brush_fe403c":  content.strokeStyle="#fe403c"; brush_color_gobal="#fe403c"; content.lineWidth=brush_size_gobal; break;
                case "brush_ffcb37":  content.strokeStyle="#ffcb37"; brush_color_gobal="#ffcb37"; content.lineWidth=brush_size_gobal; break;
                case "brush_fefe4d":  content.strokeStyle="#fefe4d"; brush_color_gobal="#fefe4d"; content.lineWidth=brush_size_gobal; break;
                case "brush_4acd85":  content.strokeStyle="#4acd85"; brush_color_gobal="#4acd85"; content.lineWidth=brush_size_gobal; break;
                case "brush_4bcbfb":  content.strokeStyle="#4bcbfb"; brush_color_gobal="#4bcbfb"; content.lineWidth=brush_size_gobal; break;
                case "brush_4b9ed8":  content.strokeStyle="#4b9ed8"; brush_color_gobal="#4b9ed8"; content.lineWidth=brush_size_gobal; break;
                case "brush_000000":  content.strokeStyle="#000000"; brush_color_gobal="#000000"; content.lineWidth=brush_size_gobal; break;
            }
        }

        switch (action_type){
            case "write": getAxis(id,canvasContent,content); break;
            case "drow":  getAxis(id,canvasContent,content); break;
            case "rubber":  getAxis(id,canvasContent,content); break;
            case "cleanAll":  cleanAll(canvasContent,content); break;
        }
       
    }

 
//==============================获得坐标===========================
    function getAxis(id,canvasContent,content){

        canvasContent.onmousedown=function(event){
            var e = event || window.event;
            axis_begin_json["x"]=e.pageX - this.offsetLeft;
            axis_begin_json["y"]=e.pageY - this.offsetTop;
            axis_start_last=[axis_begin_json["x"],axis_begin_json["y"]];
            
            /**存储存放历史坐标对象标志 处理存放历史坐标过渡数组*/
            switch (id){
                case "drowLine": tag_line++; break;
                case "drowRect": tag_rect++; break;
                case "drowTri": tag_tri++; break;
                case "drowCirle": tag_circle++; break;
                case "drowWrite": tag_write++; 
                                  axis_write_last=[];
                                  cleanAllPicture(canvasContent,content);
                                  historyDrow(content);
                                  var current_write_arr=[axis_begin_json["x"],axis_begin_json["y"],brush_size_gobal,brush_color_gobal];
                                  axis_write_last.push(current_write_arr); 
                                  break;
                case "rubber": axis_rubber_last=[]; break;
            }
           
            canvasContent.addEventListener("mousemove",getMouseover,false);
        }

        function getMouseover(event){
            var ev = event || window.event;
            axis_move_json["x"]=ev.pageX - this.offsetLeft;
            axis_move_json["y"]=ev.pageY - this.offsetTop;
            axis_end_last=[axis_move_json["x"],axis_move_json["y"]];
            
            /**写字 */
            if(id=="drowWrite"){
                /**添加写字历史坐标 */
                var current_write_arr=[axis_move_json["x"],axis_move_json["y"],brush_size_gobal,brush_color_gobal];
                axis_write_last.push(current_write_arr);
            }

            /**橡皮擦 */
            if(id=="rubber"){
                /**添加橡皮擦坐标 */
                var current_rubber_axis=[axis_end_last[0],axis_end_last[1],"#ffffff",brush_size_gobal];
                axis_rubber_last.push(current_rubber_axis);
            }
            
            setTimeout(setMoveLine(),100);
        }
        
        canvasContent.onmouseup=function(event){
            clearTimeout(setMoveLine());
            canvasContent.removeEventListener("mousemove",getMouseover,false);
            var current_point={};
            
            /*保存历史坐标变量*/
            if(id=="drowLine"){
                var tag="line_"+tag_line;  
                current_point[tag]=[axis_start_last,axis_end_last,brush_size_gobal,brush_color_gobal];
            }else if(id=="drowRect"){
                var tag="rect_"+tag_rect;  
                current_point[tag]=[axis_start_last,axis_end_last,brush_size_gobal,brush_color_gobal];
            }else if(id=="drowTri"){
                var tag="tri_"+tag_tri;  
                current_point[tag]=[axis_start_last,axis_end_last,brush_size_gobal,brush_color_gobal];
            }else if(id=="drowCirle"){
                var tag="circle_"+tag_circle;  
                current_point[tag]=[axis_start_last,axis_end_last,brush_size_gobal,brush_color_gobal];
            }else if(id=="rubber"){
                tag_rubber++; 
                var tag="rubber_"+tag_rubber; 
                current_point[tag]=axis_rubber_last;
            }else if(id=="drowWrite"){
                write_start_point=[];
                var tag="write_"+tag_write;
                current_point[tag]=axis_write_last;
            }
            /**存储所有坐标变量 */
            axis_last.push(current_point);
            //console.log(axis_last);
        }
        
        /**动态画图 */
        function setMoveLine(){
            switch (id){
                case "drowLine": lineDrow(canvasContent,content); break;
                case "drowRect": rectDrow(canvasContent,content); break;
                case "drowTri": triDrow(canvasContent,content); break;
                case "drowCirle": cirleDrow(canvasContent,content); break;
                case "drowWrite": writeDrow(canvasContent,content); break;
                case "rubber": rubberDrow(canvasContent,content); break;
            }
        }
    }

//===============================重绘历史图形================================
    function historyDrow(content){
        if(axis_last!=[]){
            for(var i in axis_last){
                for(var j in axis_last[i]){
                    if(j){
                        var pictureType=j.split("_")[0];
                        /**直线 */
                        if(pictureType=="line"){
                            var axis_line_point=axis_last[i][j];
                            historyLineDrow(content,axis_line_point);
                        }
                        /**矩形 */
                        if(pictureType=="rect"){
                            var axis_rect_point=axis_last[i][j];
                            historyRectDrow(content,axis_rect_point);
                        }
                        /**三角形 */
                        if(pictureType=="tri"){
                            var axis_tri_point=axis_last[i][j];
                            historyTriDrow(content,axis_tri_point);
                        }
                        /**圆形 */
                        if(pictureType=="circle"){
                            var axis_circle_point=axis_last[i][j];
                            historyCircleDrow(content,axis_circle_point);
                        }
                        /**橡皮擦 */
                        if(pictureType=="rubber"){
                            var axis_rubber_point=axis_last[i][j];
                            historyRubber(content,axis_rubber_point);
                        }
                        /**写字 */
                        if(pictureType=="write"){
                            var axis_write_point=axis_last[i][j];
                            historyWrite(content,axis_write_point);
                        }

                    }
                }
            }
        }
        
    }

//================================写字==============================
    function writeDrow(canvasContent,content){
                cleanAllPicture(canvasContent,content);
                historyDrow(content);
                for(var i=0;i<axis_write_last.length-1;i++){
                    content.lineWidth=brush_size_gobal;
                    content.strokeStyle=brush_color_gobal;
                    content.beginPath();
                    content.moveTo(axis_write_last[i][0], axis_write_last[i][1]);
                    content.lineTo(axis_write_last[i+1][0], axis_write_last[i+1][1]);
                    /*if(write_start_point.length==0){
                        content.moveTo(axis_start_last[0], axis_start_last[1]);
                        content.lineTo(axis_end_last[0], axis_end_last[1]);
                        write_start_point=axis_end_last;
                    }else{
                        content.moveTo(write_start_point[0], write_start_point[1]);
                        content.lineTo(axis_end_last[0], axis_end_last[1]);
                        write_start_point=axis_end_last;
                    }*/
                    content.closePath();
                    content.stroke();
                }
           
    }

    function historyWrite(content,writeAxis){
            for(var k=0;k<writeAxis.length-1;k++){
                var write_start_x=writeAxis[k][0];
                var write_start_y=writeAxis[k][1];
                content.lineWidth=writeAxis[k+1][2];
                content.strokeStyle=writeAxis[k+1][3];
                var write_end_x=writeAxis[k+1][0];
                var write_end_y=writeAxis[k+1][1];
                content.beginPath();
                content.moveTo(write_start_x, write_start_y);
                content.lineTo(write_end_x, write_end_y);
                content.closePath();
                content.stroke();            
            }
    }

//===============================橡皮擦===============================

    function rubberDrow(canvasContent,content){
        cleanAllPicture(canvasContent,content);
        historyDrow(content);
        for(var j in axis_rubber_last){
            content.fillStyle="#ffffff";
            var radiusLen=8*axis_rubber_last[j][3];
            content.beginPath();
            content.arc(axis_rubber_last[j][0]-10,axis_rubber_last[j][1]-10,radiusLen,0,2*Math.PI);
            content.closePath();
            content.fill();
        }
    }

    function historyRubber(content,rubberAxis){
        for(var i in rubberAxis){
           content.fillStyle="#ffffff";
           var radiusArc=8*rubberAxis[i][3];
           content.beginPath();
           content.arc(rubberAxis[i][0]-10,rubberAxis[i][1]-10,radiusArc,0,2*Math.PI);
           content.fill();
           content.closePath();
        }
    }

//=================================绘制直线===================================
    function lineDrow(canvasContent,content){
        if(axis_move_json!={}){
            cleanAllPicture(canvasContent,content);
            /**重绘历史图形 */
            historyDrow(content);
            /**设置画笔大小及颜色 */
            content.lineWidth=brush_size_gobal;
            content.strokeStyle=brush_color_gobal;
            content.beginPath();
            content.moveTo(axis_begin_json.x, axis_begin_json.y);
            content.lineTo(axis_move_json.x, axis_move_json.y);
            content.closePath();
            content.stroke();
            
        }
   }
    /**重绘历史直线 */
    function historyLineDrow(content,lineAxis){
            /**设置画笔大小及颜色 */
            content.lineWidth=lineAxis[2];
            content.strokeStyle=lineAxis[3];
            content.beginPath();
            var start_x=lineAxis[0][0];
            var start_y=lineAxis[0][1];
            var end_x=lineAxis[1][0];
            var end_y=lineAxis[1][1];
            content.moveTo(start_x, start_y);
            content.lineTo(end_x, end_y);
            content.closePath();
            content.stroke();
    }

//=================================绘制矩形===============================
    function rectDrow(canvasContent,content){
            if(axis_move_json!={}){
                cleanAllPicture(canvasContent,content);
                /**重绘历史图形 */
                historyDrow(content);

                var rect_width=axis_move_json.x-axis_begin_json.x;
                var rect_height=axis_move_json.y-axis_begin_json.y;
                /**设置画笔大小及颜色 */
                content.lineWidth=brush_size_gobal;
                content.strokeStyle=brush_color_gobal;
                content.beginPath();
                content.rect(axis_begin_json.x,axis_begin_json.y,rect_width,rect_height);
                content.closePath();
                content.stroke();
            }
    }

    /**重绘历史矩形 */
    function historyRectDrow(content,rectAxis){
                /**设置画笔大小及颜色 */
                content.lineWidth=rectAxis[2];
                content.strokeStyle=rectAxis[3];
                content.beginPath();
                var start_x=rectAxis[0][0];
                var start_y=rectAxis[0][1];
                var end_x=rectAxis[1][0];
                var end_y=rectAxis[1][1];
                content.rect(start_x,start_y,end_x-start_x,end_y-start_y);
                content.closePath();
                content.stroke();
    }

//================================绘制三角形==============================
    function triDrow(canvasContent,content){
        if(axis_move_json!={}){
            cleanAllPicture(canvasContent,content);
            /**重绘历史图形 */
            historyDrow(content);

            var left_x=axis_begin_json.x-(axis_move_json.x-axis_begin_json.x);
            /**设置画笔大小及颜色 */
            content.lineWidth=brush_size_gobal;
            content.strokeStyle=brush_color_gobal;
            content.beginPath();
            content.moveTo(axis_begin_json.x, axis_begin_json.y);
            content.lineTo(left_x, axis_move_json.y);
            content.lineTo(axis_move_json.x, axis_move_json.y);
            content.lineTo(axis_begin_json.x, axis_begin_json.y);
            content.closePath();
            content.stroke();
        }
   }

    /**重绘历史三角形 */
    function historyTriDrow(content,triAxis){
                /**设置画笔大小及颜色 */
                content.lineWidth=triAxis[2];
                content.strokeStyle=triAxis[3];
                content.beginPath();
                var start_x=triAxis[0][0];
                var start_y=triAxis[0][1];
                var end_x=triAxis[1][0];
                var end_y=triAxis[1][1];
                var left_last_x=start_x-(end_x-start_x);
                content.moveTo(start_x, start_y);
                content.lineTo(left_last_x, end_y);
                content.lineTo(end_x, end_y);
                content.lineTo(start_x, start_y);
                content.closePath();
                content.stroke();
    }

//===============================绘制圆形================================
    function cirleDrow(canvasContent,content){
        if(axis_move_json!={}){
            cleanAllPicture(canvasContent,content);
            /**重绘历史图形 */
            historyDrow(content);

            var radius_width=(axis_move_json.x-axis_begin_json.x)*0.5;
            if(radius_width<0){
                radius_width=-radius_width;
            }
            var radius_x=axis_begin_json.x+radius_width;
            var radius_y=axis_begin_json.y+radius_width;
            /**设置画笔大小及颜色 */
            content.lineWidth=brush_size_gobal;
            content.strokeStyle=brush_color_gobal;
            content.beginPath();
            content.arc(radius_x,radius_y,radius_width,0,2*Math.PI);
            content.closePath();
            content.stroke();
        }
    }

    /**重绘历史圆形 */
    function historyCircleDrow(content,circleAxis){
                /**设置画笔大小及颜色 */
                content.lineWidth=circleAxis[2];
                content.strokeStyle=circleAxis[3];

                content.beginPath();
                var start_x=circleAxis[0][0];
                var start_y=circleAxis[0][1];
                var end_x=circleAxis[1][0];
                var end_y=circleAxis[1][1];
                var radius_last=(end_x-start_x)*0.5;
                if(radius_last<0){
                    radius_last=-radius_last;
                }
                var radius_start_x=start_x+radius_last;
                var radius_end_y=start_y+radius_last;
                content.arc(radius_start_x,radius_end_y,radius_last,0,2*Math.PI);
                content.closePath();
                content.stroke();
    }


//===============================清除全部=============================
    function cleanAll(canvasContent,content){
        cleanAllPicture(canvasContent,content);
        initAll();
    }

    function cleanAllPicture(canvasContent,content){
        var width=canvasContent.width;
        var height=canvasContent.height;
        content.clearRect(0,0,width,height);
    }

