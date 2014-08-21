importScripts("spark-md5.js")

onmessage=function(event){
  //输出信息到日志
  console.log(event.data)
  var spark = event.data
  postMessage(spark.end());
}