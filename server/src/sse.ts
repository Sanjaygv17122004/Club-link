import { Response } from 'express';

type Client = { id: number; res: Response };

const clients = new Map<number, Response>();
let nextId = 1;

export function addClient(res: Response) {
  const id = nextId++;
  clients.set(id, res);
  return id;
}

export function removeClient(id: number) {
  clients.delete(id);
}

export function sendAdminEvent(event: string, payload: any) {
  const data = JSON.stringify({ event, payload });
  for (const [id, res] of clients.entries()) {
    try {
      res.write(`data: ${data}\n\n`);
    } catch (err) {
      // ignore write errors; client will be cleaned on close
      console.error('SSE write error for client', id, err);
    }
  }
}

export default { addClient, removeClient, sendAdminEvent };
