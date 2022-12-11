self.importScripts('./spark-md5.min.js')
onmessage = function (e) {
  const { chunkList } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  const length = chunkList.length
  const loadNext = function (index) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(chunkList[index].chunk)
    reader.onload = function (e) {
      spark.append(e.target.result)
      index = index + 1
      if (index === length) {
        postMessage({
          index: index - 1,
          percentage: 100,
          hash: spark.end(),
        })
        self.close()
      } else {
        postMessage({
          index: index - 1,
          percentage: (index / length) * 100,
        })
        loadNext(index)
      }
    }
  }
  loadNext(0)
}
