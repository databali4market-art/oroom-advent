export interface User { uid: string; email: string; name: string | null }

export interface Progress {
  /** den -> ISO čas otevření */
  opened: Record<number, string>;
  newsletter: boolean;
  /** uživatel už odpověděl na nabídku newsletteru (ano i ne) – znovu se neptáme */
  newsletterAsked?: boolean;
}
