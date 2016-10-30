(function(w){

    // x:圆心x轴坐标
    // y:圆心y轴坐标
    // r:圆的半径
    // data:绘制圆饼所需的数据
    function Pie(ctx, x, y, r, data){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.r = r;
        this.data = data;

        this.textSpace = 15;
        // 扇形的颜色
        this.colors = ['green', 'gray', 'orange', 'blue', 'red', 'green'];

        // 计算1数据所对应的角度值
        this.init();
    }
    
    //给pie添加一个静态方法，该方法会把角度转化为弧度
    Pie.degs = function (deg) {
        // Math.PI / 180 得到1角度对应多少弧度
        return Math.PI / 180 * deg;
    };
    Pie.prototype={
    	// 拟补constructor丢失的问题(可不写)
    	constructor:Pie,
    	// 求1数据对应的角度 = 360度 / 数据的总和
    	init:function(){
    		var num=0;
    		//把遍历到的值赋给num
            this.data.forEach(function(dataObj){
            	num+=dataObj.val;
            });

            // 1数据所对应的角度值
            this.baseDeg=360/num;
    	},

        // 绘制饼图
        draw:function(){
            var self = this,
                angle = 0,
                startDeg = 0,
                endDeg = 0;
        	// 根据数据，画扇，共同组成一个饼图。
        	this.data.forEach(function(val,index){
        		// 计算当前扇形的结束角度
                angle=self.baseDeg*self.data[index].val;
        		
                endDeg=startDeg+angle;
        		// 画扇
        		self.ctx.beginPath();
                self.ctx.moveTo(self.x,self.y);
                self.ctx.arc(self.x,self.y,self.r,Pie.degs(startDeg),Pie.degs(endDeg));
                self.ctx.closePath();
                self.ctx.fillStyle = self.colors[index];
                self.ctx.fill();



                //求扇形中间在圆上点的坐标
               
                var tempAngle=startDeg+angle/2;  //当前扇形的中间角度
                var tempAngleX=self.x+Math.cos(Pie.degs(tempAngle))*(self.r+self.textSpace);
                var tempAngleY=self.y+Math.sin(Pie.degs(tempAngle))*(self.r+self.textSpace);
                
                //从圆心画一条扇形分隔线，用来标识文字所表示的扇形区域
                self.ctx.beginPath();
                self.ctx.moveTo(self.x,self.y);
                self.ctx.lineTo(tempAngleX,tempAngleY);
                // console.log(tempAngleX,tempAngleY);
                
                //绘制文字
                self.ctx.font = '18px 圆体';
                if(tempAngle>90 && tempAngle<270){
                    self.ctx.textAlign='right';
                    self.ctx.lineTo(tempAngleX-self.ctx.measureText(self.data[index].msg).width,tempAngleY);
                    self.ctx.fillText(self.data[index].msg,tempAngleX,tempAngleY-5);
                }else{
                    self.ctx.textAlign='left';
                    self.ctx.lineTo(tempAngleX+self.ctx.measureText(self.data[index].msg).width,tempAngleY);
                    self.ctx.fillText(self.data[index].msg,tempAngleX+4,tempAngleY-5);

                }

                self.ctx.strokeStyle=self.colors[index];
                self.ctx.stroke();

                self.ctx.textBaseline='bottom';
                //self.ctx.font = '18px 圆体';
                //self.ctx.fillText(self.data[index].msg,tempAngleX,tempAngleY-5);
                

                
                // 下一个扇形的起点，是当前扇形的结束点
                startDeg = endDeg;

        	});

        }
    };

    $.fn.extend({
        // 给我一些数据，我给你展示成饼图
        drawPieChart:function(data,textSpace){
            /*
             * 实现思路：
             * 1、给第一个元素中，添加一个canvas元素，在这个canvas中按照数据绘制饼图。
             * */
            var $target,$targetWidth,$targetHeight,
                cvs,ctx,pie, x, y, r,
                textSpace=textSpace || 60;
            // 获取第一个元素，以及这个元素的宽高
            $target=this.first();
            $targetWidth=parseInt( $target.css( 'width' ) );
            $targetHeight=parseInt( $target.css( 'height' ) );

            // 画布初始化
            cvs=$('<canvas></canvas>').get(0);
            cvs.width=$targetWidth;
            cvs.height=$targetHeight;
            ctx=cvs.getContext('2d');

            // 计算饼图的圆心( 在元素的中心 )
            // 计算饼图的半径( 按照宽高中比较短的来计算 )
            x=$targetWidth/2;
            y=$targetHeight/2;
            r=$targetWidth>$targetHeight?($targetHeight/2-textSpace):($targetWidth/2-textSpace);

            // 创建饼图实例，并绘制
            pie=new Pie(ctx,x,y,r,data);
            pie.draw();

            // 把canvas标记添加到第一个元素中，这样就可以在页面中浏览饼图了
            $target.append( cvs );

        }
    })
     
    // 把构造函数暴露到全局
    //w.Pie=Pie;

}(window));