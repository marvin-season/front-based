import {MockRequestType, MockResponseType} from "@/type";
import {request} from "@/utils/service.ts";
import {sleep} from "@marvin/shared";

export const exampleApi = async (params: MockRequestType): Promise<MockResponseType> => {
    const res = await fetch('/mock/example/mock');
    return await res.json();
}

export const queryApi = async (params: MockRequestType): Promise<MockResponseType> => {

    const data = await request<MockResponseType>({
        url: '/mock/example/query',
        params
    });
    if (params.name?.length % 2 === 0) {
        await sleep(2000);
    }
    return data
}
