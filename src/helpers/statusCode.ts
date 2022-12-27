import http from 'http'
import { IUser } from './user.interface';

export enum HttpCode {
  Success = 200,
  Created = 201,
  BadReq = 400,
  NotFound = 404,
  Delete = 204,
  ErrorServer = 500
}

export enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export type ReqType = http.IncomingMessage & { body: any, pathname: string, params: Record<string, string> }
export type ResType = http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; send: (code: HttpCode, data: any) => void  }

export type IHandler = (req: ReqType, res: ResType) => void