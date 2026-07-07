export function wrapAeraEmail(content: string) {
  return `
    <div style="margin:0;background:#fffaf2;padding:28px 0;font-family:Inter,Arial,sans-serif;color:#3b2f2a">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadfd5;border-radius:20px;overflow:hidden">
        <div style="padding:28px 32px;border-bottom:1px solid #eadfd5;background:#fbf1e4">
          <div style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#7a4f32">Aera Nail Lounge</div>
          <div style="margin-top:6px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#9a6a46">Los Angeles</div>
        </div>
        <div style="padding:30px 32px;line-height:1.65;font-size:15px">
          ${content}
        </div>
      </div>
    </div>
  `;
}
