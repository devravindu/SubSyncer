import srtParser2 from "srt-parser-2";
import { SrtSubtitle } from "./types";

const parser = new srtParser2();

const parser = new srtParser2();

export function parseSrt(srt: string): SrtSubtitle[] {
  return parser.fromSrt(srt);
}

export function buildSrt(subs: SrtSubtitle[]): string {
  return parser.toSrt(subs);
}
