import { type Ref } from 'vue';

export const DEFAULT_ENV_TEMPLATE = `# ====================================================
# [繝悶Ο繝・け1] 讖溽ｨｮ繝ｻ繝・せ繝医＃縺ｨ縺ｮ螟画峩鬆・岼
# ====================================================

# 繝・せ繝亥ｯｾ雎｡縺ｮ繝懊・繝牙錐縺ｨ繧ｷ繝ｪ繝ｼ繧ｺ蜷・
BOARD=
SERIES=

# 隱ｭ縺ｿ霎ｼ繧險ｭ螳壹ヵ繧｡繧､繝ｫ繧貞・繧頑崛縺医ｋ縺溘ａ縲∝ｯｾ雎｡讖溽ｨｮ縺ｫ蠢懊§縺ｦ莉･荳九ｒ謖・ｮ壹＠縺ｦ縺上□縺輔＞・井ｸ崎ｦ√↑蝣ｴ蜷医・遨ｺ谺・ｼ・# - AC15/AC25 : V2A 縺ｾ縺溘・ V3A
# - AR繧ｷ繝ｪ繝ｼ繧ｺ: WoM 縺ｾ縺溘・ 遨ｺ谺・# - AX30      : A 縺ｾ縺溘・ B
DEVICE_TYPE=

# 繝ｪ繝ｪ繝ｼ繧ｹFW縺ｮ・｢1縺､蜑搾ｽ｣縺ｮ繝舌・繧ｸ繝ｧ繝ｳ縺ｮFW繝輔ぃ繧､繝ｫ蜷・PREV_FIRMWARE_NAME=

# 莉雁屓繝・せ繝医☆繧九Μ繝ｪ繝ｼ繧ｹFW縺ｮ繝輔ぃ繧､繝ｫ蜷・TEST_FIRMWARE_NAME=

# ====================================================
# [繝悶Ο繝・け2] 繝・せ繝育腸蠅・ｼ域球蠖楢・ｼ峨＃縺ｨ縺ｮ險ｭ螳夐・岼
# 窶ｻ蛻晏屓繧ｻ繝・ヨ繧｢繝・・譎ゅ↓縺碑・霄ｫ縺ｮ迺ｰ蠅・↓蜷医ｏ縺帙※險ｭ螳壹＠縲∽ｻ･髯阪・菴ｿ縺・屓縺励∪縺吶・# ====================================================

# 繝輔ぃ繧､繝ｫ繧ｵ繝ｼ繝舌・縺ｮ繧｢繧ｯ繧ｻ繧ｹURL縺ｨ繝昴・繝茨ｼ医・繝ｼ繝域欠螳壹′縺ｪ縺・ｴ蜷医・遨ｺ谺・ｼ・# 窶ｻURL縺ｫ縺ｯ蠢・ｦ√↓蠢懊§縺ｦ繝代せ・・firmware縺ｪ縺ｩ・峨∪縺ｧ蜷ｫ繧√※險ｭ螳壹＠縺ｦ縺上□縺輔＞
PC_SERVER_URL=http://192.168.0.6
PC_SERVER_PORT=10068

# 繝・せ繝医↓菴ｿ逕ｨ縺吶ｋ繧､繝ｳ繧ｿ繝ｼ繝阪ャ繝亥屓邱夊ｨｭ螳・# 窶ｻ豕ｨ諢擾ｼ哦UI繧｢繧ｯ繧ｻ繧ｹ逕ｨ繝阪ャ繝医Ρ繝ｼ繧ｯ(192.168.0.x)縺ｨ繧｢繝峨Ξ繧ｹ蟶ｯ縺碁㍾隍・＠縺ｪ縺・ｈ縺・ｨｭ螳壹＠縺ｦ縺上□縺輔＞縲・INTERNET_ADDRESS=192.168.1.90/24
INTERNET_GATEWAY_ADDRESS=192.168.1.10

# 繝・せ繝医↓菴ｿ逕ｨ縺吶ｋSIM諠・ｱ
SIM_APN=soracom.io
SIM_USERNAME=sora
SIM_PASSWORD=sora

# ====================================================
# [繝悶Ο繝・け3] 繧ｷ繧ｹ繝・Β蝗ｺ螳壼､・亥､画峩遖∵ｭ｢・・# ====================================================

# 繝・ヰ繧､繧ｹ謗･邯壽ュ蝣ｱ・医ョ繝輔か繝ｫ繝郁ｨｭ螳夲ｼ・BASE_URL=https://192.168.0.254
HOST=192.168.0.254

# 隱崎ｨｼ諠・ｱ
TEST_USERNAME=admin
TEST_PASSWORD=yoko1234

# CLI繝舌ャ繧ｯ繧ｨ繝ｳ繝画磁邯壽ュ蝣ｱ
CLI_SERVER_URL=http://localhost
CLI_SERVER_PORT=8080`;

export function useSessionEnvTemplate(formData: Ref<unknown>) {
  const updateEnvVariables = () => {
    let env = (formData.value as Record<string, string>).envContent || DEFAULT_ENV_TEMPLATE;

    if (!env.includes("# [繝悶Ο繝・け1]")) {
      const oldValues: Record<string, string> = {};
      env.split("\n").forEach((line: string) => {
        const idx = line.indexOf("=");
        if (idx > -1 && !line.trim().startsWith("#")) {
          const k = line.substring(0, idx).trim();
          const v = line.substring(idx + 1).trim();
          oldValues[k] = v;
        }
      });

      env = DEFAULT_ENV_TEMPLATE;

      const mergeUpsert = (key: string, value: string) => {
        if (!value) return;
        const regex = new RegExp(`^${key}=.*$`, "m");
        if (env.match(regex)) {
          env = env.replace(regex, `${key}=${value}`);
        } else {
          env += (env && !env.endsWith("\n") ? "\n" : "") + `${key}=${value}`;
        }
      };

      Object.entries(oldValues).forEach(([k, v]) => mergeUpsert(k, v));
    }

    const upsert = (key: string, value: string | undefined) => {
      if (value === undefined || value === null) return;
      const regex = new RegExp(`^${key}=.*$`, "m");
      if (env.match(regex)) {
        env = env.replace(regex, `${key}=${value}`);
      } else {
        env += (env && !env.endsWith("\n") ? "\n" : "") + `${key}=${value}`;
      }
    };

    const formDataVal = (formData.value as Record<string, string>) || {};
    const board = formDataVal.board || "";
    const series = formDataVal.series || "";
    const deviceTypeValue = formDataVal.deviceType || "";
    const baseUrl = formDataVal.baseUrl || "";

    upsert("BOARD", board);
    upsert("SERIES", series);
    upsert("DEVICE_TYPE", deviceTypeValue);
    upsert("BASE_URL", baseUrl);

    try {
      const host = new URL(baseUrl).hostname;
      upsert("HOST", host || baseUrl.replace(/^https?:\/\//, ""));
    } catch (e: unknown) {
      upsert("HOST", baseUrl.replace(/^https?:\/\//, ""));
    }

    // Set defaults if not exist
    if (!env.includes("TEST_USERNAME=")) upsert("TEST_USERNAME", "admin");
    if (!env.includes("TEST_PASSWORD=")) upsert("TEST_PASSWORD", "yoko1234");
    if (!env.includes("CLI_SERVER_URL="))
      upsert("CLI_SERVER_URL", "http://localhost");

    (formData.value as Record<string, string>).envContent = env;
  };

  const resetEnv = () => {
    (formData.value as Record<string, string>).envContent = DEFAULT_ENV_TEMPLATE;
    updateEnvVariables();
  };

  return { updateEnvVariables, resetEnv };
}

