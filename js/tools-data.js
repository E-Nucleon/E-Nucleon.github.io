// EE 开发工具箱目录数据（首页自动渲染用）
// 新增工具：在 EE_Toolbox/index.html 的 TOOLS 数组追加后，同步到这里即可。
window.EE_TOOLS = [
    {
        name: '带保护板电池内阻叠加效应模拟器',
        file: 'battery-protection-resistance-simulator.html',
        category: '电池 / 电源',
        icon: '\uD83D\uDD0B',
        description: '模拟电芯内阻与保护板/线束阻抗叠加造成的负载压降，对比理想 OCV、裸电芯、带保护板三种场景下触碰关机阈值时的真实剩余容量，支持导出 CSV。',
        tags: ['电池', '内阻', '保护板', '压降', 'SoC', 'BMS', '锂电池']
    },
    {
        name: '电容单位换算器',
        file: 'capacitor-unit-converter.html',
        category: '基础计算器',
        icon: '\u26A1',
        description: '在 F / mF / μF / nF / pF / kF 六种电容单位之间实时双向换算，支持一键复制，内置常见电容值速查表。',
        tags: ['电容', '单位换算', 'F', 'μF', 'nF', 'pF', '电子元件']
    }
,
    {
        name: '上下拉电阻分压计算器',
        file: 'pullup-pulldown-divider-calculator.html',
        category: '基础计算器',
        icon: '\u03A9',
        description: '两电阻串联分压（高边 R1 接 VCC，低边 R2 接 GND）。输入 VCC、目标 Vout、阻值级别与允许误差，给出 1 组理论精确配比 + 5 组 E24/E96 标准阻值配比（达标绿底 / 近似黄底），并可自定义 R1/R2 反算实际输出电压、静态电流与功耗。',
        tags: ['分压', '电阻', '上拉', '下拉', 'Vout', 'E24', 'E96', '欧姆定律']
    },
    {
        name: 'RC 延时计算器',
        file: 'rc-delay-calculator.html',
        category: '基础计算器',
        icon: '\u23F1',
        description: '计算 RC 一阶电路充电延时：正向模式输入 R、C、Vs、Vth 实时给出 τ/达到阈值时间/5τ；反向模式从 R/C/目标时间 t 三选二，反求未知量并匹配 E24/E96（R）或 E6/E12（C）标准值，绘制充电曲线，支持导出 CSV。',
        tags: ['RC', '延时', '时间常数', 'τ', '充电曲线', '一阶电路', '复位', 'E24', 'E96', 'E6', 'E12']
    },
    {
        name: '555 定时器计算器',
        file: '555-timer-calculator.html',
        category: '基础计算器',
        icon: '⏲',
        description: '无稳态模式输入 R1、R2、C 实时计算振荡频率、占空比与高/低电平时间；单稳态模式计算输出脉宽 t=1.1RC；绘制 Vc 与 Vout 双通道波形，含 1/3、2/3 Vcc 阈值线，支持导出 CSV。',
        tags: ['555', '定时器', '无稳态', '单稳态', '多谐振荡', '频率', '占空比', '方波', '脉宽']
    },
    {
        name: 'PCB 走线载流计算器',
        file: 'pcb-trace-current-calculator.html',
        category: 'PCB 设计',
        icon: '\uD83D\uDCD0',
        description: '基于 IPC-2221：已知电流、温升、铜厚与内/外层求所需走线宽度，或已知线宽反求允许载流；同时给出截面积、走线电阻与压降（含温升修正），绘制宽度-电流曲线并标注工作点，支持导出 CSV。',
        tags: ['PCB', '走线宽度', '载流', 'IPC-2221', '铜厚', 'oz', '温升', '压降', '线宽']
    },
    {
        name: 'LED 限流电阻计算器',
        file: 'led-resistor-calculator.html',
        category: '基础计算器',
        icon: '💡',
        description: '输入电源电压、LED 压降（含颜色预设）、串联数量与工作电流，计算理论限流电阻、功耗与 2 倍降额选型值；自动匹配 E24/E96 标准阻值并给出实际电流偏差，绘制电流-电阻曲线，支持导出 CSV。',
        tags: ['LED', '限流电阻', 'E24', 'E96', '降额', '功耗', '压降', '工作电流']
    },
    {
        name: 'LDO 功耗与热计算器',
        file: 'ldo-power-thermal-calculator.html',
        category: '电池 / 电源',
        icon: '🔥',
        description: '计算 LDO 压差损耗 Pd=(Vin−Vout)·Iout+Vin·Iq、结温 Tj=Tamb+Pd·θJA 与效率；绘制 Vin 扫描的功耗/结温双轴曲线并标注 125°C 上限，帮助评估压差发热与是否该换 Buck，支持导出 CSV。',
        tags: ['LDO', '功耗', '结温', '热阻', 'θJA', '效率', '压差', '发热', 'Iq']
    },
    {
        name: 'Buck 电感选型计算器',
        file: 'buck-inductor-calculator.html',
        category: '电池 / 电源',
        icon: '⚡',
        description: '根据 Vin/Vout/开关频率/负载电流与纹波率计算 Buck 所需电感量、纹波电流、峰值电流与 CCM 临界电感；绘制 3 周期电感电流波形并标注峰谷，支持导出 CSV 纹波率扫描表。',
        tags: ['Buck', '电感', '纹波', '纹波率', '峰值电流', '临界电感', 'CCM', '开关频率', 'DC-DC']
    },
    {
        name: '滤波器截止频率计算器',
        file: 'filter-cutoff-calculator.html',
        category: '基础计算器',
        icon: '〰',
        description: '一阶 RC 低通/高通 fc=1/(2πRC) 与二阶 LC 低通 fc=1/(2π√LC)；对数控件选取 R、C、L，实时绘制幅频响应曲线（−3dB 点标注、−20/−40dB/dec 滚降），支持导出 CSV。',
        tags: ['滤波器', '截止频率', '低通', '高通', 'RC', 'LC', '幅频', '波特图', '-3dB']
    },
    {
        name: '分压计算器',
        file: 'voltage-divider-calculator.html',
        category: '基础计算器',
        icon: '⚖',
        description: '电阻分压器设计：输入 Vin 与 R1/R2，计算空载与带载（R2∥RL）输出电压、静态功耗与负载调整偏差；绘制 Vout-RL 曲线并标注空载参考线，支持导出 CSV。',
        tags: ['分压', '分压器', '电阻', '负载', '静态功耗', '负载调整率', '空载', 'Vout']
    },
    {
        name: '串并联电阻计算器',
        file: 'series-parallel-resistor-calculator.html',
        category: '基础计算器',
        icon: '🔗',
        description: '两电阻串联/并联一键切换：计算等效电阻、总电流与各自功耗/分压；自动匹配最接近的 E24 标准值组合（2×2 候选表），绘制 Req-R2 曲线（并联极限线），支持导出 CSV。',
        tags: ['串联', '并联', '等效电阻', 'E24', '标准值', '分压', '功耗', '电阻组合']
    },
    {
        name: '导线压降计算器（AWG）',
        file: 'wire-voltage-drop-calculator.html',
        category: '电池 / 电源',
        icon: '🔌',
        description: '铜导线（AWG 线规）载流评估：输入电流、单程线长、系统电压与允许压降，计算往返回路压降、线损功率与电流密度，自动推荐满足压降的最细线规；绘制压降-AWG 曲线，支持导出 CSV。',
        tags: ['AWG', '线规', '压降', '线损', '导线', '电流密度', '线径', '载流']
    },
    {
        name: '微带线特征阻抗计算器',
        file: 'microstrip-impedance-calculator.html',
        category: 'PCB 设计',
        icon: '📏',
        description: '基于 IPC-2141：微带线/带状线双模式，输入线宽 W、介质厚度 H、介电常数（FR-4/罗杰斯等材质预设）与铜厚，计算特征阻抗 Z0 与目标偏差；绘制 Z0-W 曲线，支持导出 CSV。',
        tags: ['微带线', '带状线', '阻抗', '特征阻抗', 'Z0', 'IPC-2141', '传输线', 'FR-4', '线宽']
    },
    {
        name: '电池续航计算器',
        file: 'battery-runtime-calculator.html',
        category: '电池 / 电源',
        icon: '🔋',
        description: '估算电池在给定负载下的续航时间：输入容量、平均电流、标称电压与降额系数，计算续航小时数、放电倍率 C-rate 与可用能量 Wh；绘制 SOC-时间放电曲线并标注 20% 回充点，支持导出 CSV。',
        tags: ['电池', '续航', '容量', 'mAh', 'C-rate', '放电倍率', 'SOC', '自放电', 'Wh']
    },
    {
        name: 'Boost 电感选型计算器',
        file: 'boost-inductor-calculator.html',
        category: '电池 / 电源',
        icon: '🔼',
        description: 'Boost 升压变换器电感设计：输入 Vin/Vout/开关频率/输出电流/纹波率/效率，计算占空比、输入平均电流、所需电感量、峰/谷电流与临界电感（DCM 边界）；绘制 3 周期电感电流波形，支持导出 CSV 纹波率扫描表。',
        tags: ['Boost', '升压', '电感', '占空比', '纹波率', '峰值电流', '临界电感', 'DCM', 'DC-DC']
    },
    {
        name: '运放放大器计算器',
        file: 'opamp-amplifier-calculator.html',
        category: '基础计算器',
        icon: '📐',
        description: '单级运放放大器设计：同相/反相模式切换，由 Rf/Rg 计算闭环增益（V/V 与 dB）与输出幅度，检查电源轨削波；自动匹配 E24 标准值增益组合表，绘制增益-Rf 曲线，支持导出 CSV。',
        tags: ['运放', '放大器', '同相', '反相', '增益', 'dB', '反馈电阻', '削波', 'E24']
    },
    {
        name: '电流采样电阻计算器',
        file: 'current-sense-resistor-calculator.html',
        category: '电池 / 电源',
        icon: '🎯',
        description: '电流检测分流电阻设计：由待测电流与目标采样电压计算阻值、功耗与 2 倍降额功率档位，给出 E24 标准值候选表与 ADC 电流分辨率估算；绘制 Vsense-R 曲线，支持导出 CSV。',
        tags: ['采样电阻', '分流', '电流检测', 'shunt', '功耗', '降额', 'ADC', '分辨率', 'Kelvin']
    },
    {
        name: '欧姆定律与功率计算器',
        file: 'ohms-law-power-calculator.html',
        category: '基础计算器',
        icon: 'Ω',
        description: 'V/I/R/P 四量知二求二：勾选任意两个已知量实时解出其余两个，附公式验算与每小时耗电；绘制 I-V 特性与功率双轴曲线并标注工作点，支持导出 CSV。',
        tags: ['欧姆定律', '功率', '电压', '电流', '电阻', '知二求二', 'P=VI', 'V=IR']
    },
    {
        name: '稳压管稳压计算器',
        file: 'zener-regulator-calculator.html',
        category: '电池 / 电源',
        icon: '🛡',
        description: '齐纳并联稳压电路设计：给定输入电压范围、Vz 与负载电流范围，计算限流电阻 Rz 及功率档位、稳压管最大电流与功耗，验证全工况可行域；绘制 Iz-Vin 工作区间图，支持导出 CSV。',
        tags: ['稳压管', '齐纳', 'Zener', '限流电阻', '稳压', 'Iz', '功耗', 'Rz']
    },
    {
        name: '电容储能计算器',
        file: 'capacitor-energy-calculator.html',
        category: '基础计算器',
        icon: '🥫',
        description: '电容器储能与安全评估：E=½CV² 储能、Q=CV 电荷量、短路峰值电流 V/ESR 与放电时间常数；能量分级电击风险警告，绘制储能-电压抛物线并标注 1J 阈值，支持导出 CSV。',
        tags: ['电容', '储能', '能量', '电荷', 'ESR', '峰值电流', '电击', '泄放', '安全']
    },
    {
        name: 'MOSFET 导通损耗计算器',
        file: 'mosfet-conduction-loss-calculator.html',
        category: '电池 / 电源',
        icon: '⚙',
        description: '考虑 Rds(on) 正温度系数，迭代求解导通损耗、平衡结温与热态电阻；绘制结温-电流曲线并标注 125/150°C 降额与上限线，评估散热与选型，支持导出 CSV。',
        tags: ['MOSFET', '导通损耗', 'Rds', '结温', '热阻', '温度系数', '热平衡', '散热']
    },
    {
        name: '三极管开关计算器',
        file: 'bjt-switch-calculator.html',
        category: '基础计算器',
        icon: '🔷',
        description: '按集电极电流与 hFE 计算 BJT 基极限流电阻，支持过驱动倍数设置；从 E24 系列中选取保证饱和且最接近理论值的阻值，给出实际基极电流、饱和压降与功耗校验，支持导出 CSV。',
        tags: ['三极管', 'BJT', '基极电阻', '开关', '饱和', '过驱动', 'hFE', 'E24']
    },
    {
        name: 'I2C 上拉电阻计算器',
        file: 'i2c-pullup-calculator.html',
        category: '基础计算器',
        icon: '🚍',
        description: '根据 Vdd 与总线电容计算 I2C 上拉电阻允许范围（VOL 下限与上升时间上限），支持标准/快速/快速+ 速率切换；推荐几何中点附近的 E24 阻值并绘制 tr-Rp 曲线与可行域，支持导出 CSV。',
        tags: ['I2C', '上拉电阻', '总线电容', '上升时间', '速率', 'E24', '可行域']
    },
    {
        name: '晶振负载电容计算器',
        file: 'crystal-load-capacitor-calculator.html',
        category: '基础计算器',
        icon: '💎',
        description: '双模式：按晶振规格负载电容与杂散电容反推所需外接电容并从 E6 系列就近选型，校验实际负载电容偏差；或直接输入已选电容验证 CL 是否达标，偏差超限分级告警，支持导出 CSV。',
        tags: ['晶振', '负载电容', 'XTAL', '杂散电容', 'E6', '匹配', '偏差']
    },
    {
        name: 'ADC/DAC 分辨率计算器',
        file: 'adc-dac-resolution-calculator.html',
        category: '基础计算器',
        icon: '🎚',
        description: '按参考电压与位数计算 LSB、满量程与理论 SNR；支持电压↔码值双向换算（Code/十六进制/百分比），绘制量化阶梯图并标注输入位置，位数切换实时联动，支持导出 CSV。',
        tags: ['ADC', 'DAC', '分辨率', 'LSB', 'SNR', '量化', '码值']
    },
    {
        name: 'PWM 频率占空比计算器',
        file: 'pwm-frequency-duty-calculator.html',
        category: '基础计算器',
        icon: '📶',
        description: '按 MCU 定时器系统时钟、预分频 PSC、自动重装载 ARR 与比较值 CCR 计算 PWM 频率、周期、占空比与分辨率；绘制带占空着色的双周期方波，校验 CCR 越界并支持导出占空扫描 CSV。',
        tags: ['PWM', '定时器', '占空比', '频率', 'PSC', 'ARR', 'CCR', '分辨率', 'MCU']
    },
    {
        name: 'UART 波特率计算器',
        file: 'uart-baudrate-calculator.html',
        category: '基础计算器',
        icon: '📡',
        description: '按系统时钟与过采样率计算 UART 分频系数、实际波特率与误差；覆盖 8 档常用波特率全表对比与误差柱状图，标注 ±2%/±4% 可靠阈值并高亮最优档位，支持导出 CSV。',
        tags: ['UART', '波特率', '分频', '误差', '过采样', '串口', 'MCU']
    },
    {
        name: '电容阻抗计算器',
        file: 'capacitor-impedance-calculator.html',
        category: '基础计算器',
        icon: '🔌',
        description: '按容值、ESR、ESL 与工作频率计算电容阻抗、容抗、感抗与自谐振频率 SRF；绘制 1kHz~100MHz 的 Z-f 对数曲线并标注 SRF 谷底与工作点，评估去耦选型，支持导出 CSV。',
        tags: ['电容', '阻抗', 'ESR', 'ESL', 'SRF', '自谐振', '去耦', 'Bode']
    },
    {
        name: '晶振频率误差计算器',
        file: 'crystal-frequency-error-calculator.html',
        category: '基础计算器',
        icon: '⏱',
        description: '按初始偏差与温度漂移最坏叠加估算晶振总误差（PPM）、频率偏差与每日时间漂移，并给出 RSS 统计值；绘制误差随温度变化曲线与分级阈值线，支持导出 CSV。',
        tags: ['晶振', 'PPM', '频率误差', '温漂', '精度', '时间漂移', 'RSS']
    },
    {
        name: '热阻与散热器计算器',
        file: 'thermal-resistance-heatsink-calculator.html',
        category: '电池 / 电源',
        icon: '🌡',
        description: '按结-壳-接触-散热器热阻链计算结温、总热阻与最大允许功耗，评估温度裕量；绘制结温随功耗扫描曲线并标注上限与余量线，支持导出 CSV。',
        tags: ['热阻', '散热器', '结温', 'θJC', 'θSA', '功耗', 'Tjmax', '裕量']
    },
    {
        name: 'dBm 功率换算计算器',
        file: 'dbm-power-converter.html',
        category: '基础计算器',
        icon: '📻',
        description: '射频功率单位换算：dBm/mW/W/μW 四卡同步显示，支持 dBm/mW/W 三档输入切换；附 −30~+30dBm 常用功率对照表与对数曲线，高功率与噪声地板分级提示，支持导出 CSV。',
        tags: ['dBm', '功率换算', 'mW', '射频', 'RF', '无线', '对数']
    },
    {
        name: '天线长度计算器',
        file: 'antenna-length-calculator.html',
        category: '基础计算器',
        icon: '🗼',
        description: '按频率与速度因子（自由空间/同轴/FR4 微带）计算波长 λ、λ/2 与 λ/4 振子长度；绘制 λ/4-频率对数曲线并标注 433M/868M/915M/2.4G/5.8G 常用频段参考点，支持导出 CSV。',
        tags: ['天线', '波长', '频率', 'λ/4', '速度因子', '振子', 'RF', 'LoRa', 'WiFi']
    },
    {
        name: '超级电容后备计算器',
        file: 'supercapacitor-backup-calculator.html',
        category: '电池 / 电源',
        icon: '⏳',
        description: '按电容、初始/截止电压与负载电流计算恒流放电后备时间、释放能量与压降速率，评估 RTC 掉电保持；绘制电压跌落曲线并标注截止线与可用能量区，支持导出 CSV。',
        tags: ['超级电容', '后备', 'RTC', '掉电', '恒流放电', '截止电压', '能量']
    },
    {
        name: 'Buck-Boost 电感选型计算器',
        file: 'buck-boost-inductor-calculator.html',
        category: '电池 / 电源',
        icon: '🔁',
        description: '反极性 Buck-Boost 变换器电感设计：按输入/输出电压幅值、负载与开关频率计算占空比、电感平均电流、所需电感量与峰值电流，附临界电感；绘制 3 周期电感电流波形，支持导出纹波比扫描 CSV。',
        tags: ['Buck-Boost', '电感', '占空比', '峰值电流', '纹波', '临界电感', 'DC-DC', '反极性']
    },
    {
        name: '运放带宽计算器',
        file: 'opamp-bandwidth-calculator.html',
        category: '基础计算器',
        icon: '📈',
        description: '按增益带宽积 GBW 计算闭环带宽，校验信号频率与压摆率裕量，给出满功率带宽；绘制开环/闭环 Bode 幅频图并标注交点带宽与工作频率，分级告警失真风险，支持导出 CSV。',
        tags: ['运放', '带宽', 'GBW', '压摆率', 'Bode', '增益', '满功率带宽', '失真']
    },
    {
        name: '电池串并联计算器',
        file: 'battery-series-parallel-calculator.html',
        category: '电池 / 电源',
        icon: '🔗',
        description: '按电芯类型（锂电/磷酸铁锂/镍氢/铅酸）、容量与串并联数计算电池组电压、容量、总能量与电芯数；超压分级告警，绘制不同串联数能量对比图，支持导出多配置 CSV。',
        tags: ['电池', '串联', '并联', '电池组', '18650', '能量', 'Wh', '电芯']
    },
    {
        name: '保险丝选型计算器',
        file: 'fuse-selection-calculator.html',
        category: '电池 / 电源',
        icon: '🧨',
        description: '按负载电流与降额系数计算保险丝额定需求，从标准序列中选取最小满足值并给出实际裕量；快断/慢断提示、裕量分级告警，全表对比与裕量曲线，支持导出 CSV。',
        tags: ['保险丝', '熔断', '降额', '选型', '裕量', '快断', '慢断', '保护']
    }
];
