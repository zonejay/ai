import { ref, type Ref } from 'vue';
const key = '';

const mockMessages = [
  {
    // 创建人
    creater: 'user',
    // 当前消息场景
    scene: '文生图片',
    // 内容
    content: [
      {
        type: 'p',
        children: '厨房、白色、餐厅、',
      },
    ],
  },
  {
    // 创建人
    creater: 'assistant',
    // 当前消息场景
    scene: '文生图片',
    // 内容
    content: [
      {
        type: 'p',
        children: '厨房、白色、餐厅、',
      },
    ],
  },
  {
    // 创建人
    creater: 'user',
    // 当前消息场景
    scene: '图生模板',
    // 内容
    content: [
      {
        type: 'images',
        props: {
          images: [
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
          ],
        },
      },
    ],
  },
  {
    // 创建人
    creater: 'assistant',
    // 当前消息场景
    scene: '图生模板',
    // 内容
    content: [
      {
        type: 'images',
        props: {
          images: [
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
          ],
        },
      },
      {
        type: 'p',
        children:
          '1、色彩搭配：客厅以灰色为主色调，墙面、地面和天花板都采用了灰色的装饰，而家具则选择了浅色系，如米白色的沙发和茶几，为空间增添了一丝温馨感。吊灯和电视柜上的花瓶等装饰品也采用了金色或银色，与整体色调相得益彰。 2、照明设计：顶部中央悬挂着一个金色的吊灯，既提供了充足的光线，又成为了一个精致的装饰元素。墙上还安装了多盏射灯，可以根据需要调整亮度，满足不同的照明需求。窗户旁边设置了薄纱窗帘。',
      },
    ],
  },
  {
    // 创建人
    creater: 'user',
    // 当前消息场景
    scene: '文生图片',
    // 内容
    content: [
      {
        type: 'p',
        children: '厨房、白色、餐厅、',
      },
    ],
  },
  {
    // 创建人
    creater: 'assistant',
    // 当前消息场景
    scene: '文生图片',
    // 内容
    content: [
      {
        type: 'p',
        children: '厨房、白色、餐厅、',
      },
    ],
  },
  {
    // 创建人
    creater: 'user',
    // 当前消息场景
    scene: '图生模板',
    // 内容
    content: [
      {
        type: 'images',
        props: {
          images: [
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
          ],
        },
      },
    ],
  },
  {
    // 创建人
    creater: 'assistant',
    // 当前消息场景
    scene: '图生模板',
    // 内容
    content: [
      {
        type: 'images',
        props: {
          images: [
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
            'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
          ],
        },
      },
      {
        type: 'p',
        children:
          '1、色彩搭配：客厅以灰色为主色调，墙面、地面和天花板都采用了灰色的装饰，而家具则选择了浅色系，如米白色的沙发和茶几，为空间增添了一丝温馨感。吊灯和电视柜上的花瓶等装饰品也采用了金色或银色，与整体色调相得益彰。 2、照明设计：顶部中央悬挂着一个金色的吊灯，既提供了充足的光线，又成为了一个精致的装饰元素。墙上还安装了多盏射灯，可以根据需要调整亮度，满足不同的照明需求。窗户旁边设置了薄纱窗帘。',
      },
    ],
  },
];

export { mockMessages };

export function getOneMessage(msg) {
  const payload = { model: 'glm-4-flash', messages: [{ role: 'user', content: msg }] };
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  return new Promise((resolve, reject) => {
    fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', options)
      .then(response => response.json())
      .then(response => {
        const message = response.choices[0].message.content;
        const ret = {
          // 创建人
          creater: 'assistant',
          // 当前消息场景
          scene: '文生图片',
          // 内容
          content: [
            {
              type: 'p',
              children: message,
            },
          ],
        };
        resolve(ret);
      })
      .catch(err => reject(err));
  });
}

export function useStreamOutput(loadingControl: Ref<boolean>) {
  const output = ref('');
  // 使用fetch获取大模型流式返回的数据
  const ret = {
    // 创建人
    creater: 'assistant',
    // 当前消息场景
    scene: '文生图片',
    // 内容
    content: [
      {
        type: 'p',
        children: output,
      },
    ],
  };
  async function getStreamMessage(msg) {
    let controller = new AbortController(); // 创建新的控制器
    const signal = controller.signal; // 获取信号

    const payload = {
      model: 'glm-4-flash',
      messages: [{ role: 'user', content: msg }],
      stream: true,
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    };

    try {
      const response = await fetch(
        'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        options,
      );
      if (!response.ok) {
        throw new Error('网络响应不是 OK');
      }

      const reader = response.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let result = '';
      output.value = '';
      loadingControl.value = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break; // 读取完成

        // 解码 Uint8Array 数据并更新结果
        result = decoder.decode(value, { stream: true });
        const regex = /\{.*\}/;
        const match = result.match(regex);

        if (match) {
          console.log(match[0]);

          const result = JSON.parse(match[0]);

          output.value += result.choices[0].delta.content; // 更新输出区域
          console.log(output.value);
        }
      }

      // 处理完成后，解码剩余数据
      const rest = decoder.decode();
      console.log(rest);
    } catch (error) {
      console.log(error);
      if (controller) {
        controller.abort();
      }
      throw error;
    }
  }
  return {
    output,
    ret,
    getStreamMessage,
  };
}
