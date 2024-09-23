import useMqttStore from '@/common-feature/Mqtt';
import { AiMessage } from '@/common-feature/Mqtt/useMqtt/common/event';
import type { IResData } from '@/feature/AutoMakeOffer/service/valuation/hook';

const mqtt = useMqttStore();

export function onMessageReceive(handlerMap: Record<string, (data: IResData) => void>) {
  mqtt.on(AiMessage.MessageReceived, (resStr: any) => {
    const res: Record<string, any> = JSON.parse(resStr);
    if (res.code === 200) {
      const handler = handlerMap[res.data.type];
      handler?.(res.data);
    }
  });
}
