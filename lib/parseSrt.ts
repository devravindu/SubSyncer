import srtParser2 from "srt-parser-2";
import { SrtSubtitle } from "./types";

export function parseSrt(srt: string): SrtSubtitle[] {
  const parser = new srtParser2();
  return parser.fromSrt(srt);
}

export function buildSrt(subs: SrtSubtitle[]): string {
  const parser = new srtParser2();
  return parser.toSrt(subs);
}
