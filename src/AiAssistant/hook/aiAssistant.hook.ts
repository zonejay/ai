function checkImage(url: string) {
  const img = new Image()
  return new Promise((resolve, reject) => {
    img.onload = function (...arg) {
      console.log('图片存在:', arg, url, img)
      resolve(img)
    }
    img.onerror = function (error) {
      console.log('图片不存在或无法访问:', url, error)
      reject(new Error(`${url}图片不存在或无法访问`))
    }
    img.src = url // 触发加载
  })
}

async function checkImageType(url: string) {
  try {
    await checkImage(url)
  } catch (error) {
    console.log(error)
    throw error
  }
}

// 图片存在性校验
export async function checkImagesType(urls: string[]) {
  for (const url of urls) {
    await checkImageType(url)
  }
}

// url合法性校验
export function checkUrls(urls: string[]) {
  // 使用中文逗号分割字符串
  const urlArray = urls.split('、')
  const validHttpUrlPattern =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/i
  const ret: string[] = []
  for (const url of urlArray) {
    const trimmedUrl = url.trim() // 去除前后空格
    if (!trimmedUrl) continue

    // 检查以 http 或 https 开头的情况
    if (/^https?:\/\//.test(trimmedUrl)) {
      console.log(`"${trimmedUrl}" 是有效链接（以 http 或 https 开头）。`)
      if (!validHttpUrlPattern.test(trimmedUrl)) {
        throw new Error(`${trimmedUrl}不是有效链接`)
      }
      ret.push(trimmedUrl)
    }
    // 检查不以 http 或 https 开头且前一个字符是中文逗号
    else if (trimmedUrl.length > 0 && trimmedUrl.indexOf('http') > 0) {
      console.log(`"${trimmedUrl}" 不以 http 或 https 开头，且前一个字符是中文逗号。`)
      throw new Error('链接有误，请检查，多链接需要“、”进行分隔')
    } else {
      throw new Error('链接必须以http://或者https://开头')
    }
  }
  return ret
}

// 文件夹检测
export async function checkFolder(e: DragEvent) {
  return new Promise((resolve, reject) => {
    const {files, items} = e.dataTransfer,
      filesLength = files.length,
      itemsLength = items.length
    if (items) {
      for (let i = 0; i < itemsLength; i++)
        if ('file' !== items[i].kind || !items[i].webkitGetAsEntry().isFile) {
          resolve(true)
          break
        }
      resolve(false)
    } else {
      let count = 0
      for (let i = 0; i < filesLength; i++) {
        const file = files[i]
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
          count += 1
          count === filesLength && resolve(false)
        }
        fileReader.onerror = () => {
          resolve(true)
        }
      }
    }
  })
}

// downloadFileByBlob
export function downloadFileByBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// extract http or https url from string
export function extractHttpUrls(text: string) {
  const urlPattern =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g
  const urls = text.match(urlPattern)
  return urls
}

// console group start
