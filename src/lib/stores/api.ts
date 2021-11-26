import Wingetdotrun from "$lib/api/wingetdotrun";
import { readable } from "svelte/store";

export const api = readable(new Wingetdotrun());
