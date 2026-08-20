$ErrorActionPreference = 'Stop'
$path = 'C:\Users\EDY\Desktop\PWR\pullup-pulldown-divider-calculator.html'
$enc = New-Object System.Text.UTF8Encoding($false)
$text = [System.IO.File]::ReadAllText($path, $enc)
$c1 = [char]0x2460
$c3 = [char]0x2462

function Do-Replace($hay, $old, $new) {
    $idx = $hay.IndexOf($old)
    if ($idx -lt 0) { throw ('anchor not found: ' + $old.Substring(0, [Math]::Min(40, $old.Length))) }
    if ($hay.IndexOf($old, $idx + 1) -ge 0) { throw 'anchor not unique' }
    return $hay.Replace($old, $new)
}

# 1) container width
$text = Do-Replace $text '.container { max-width: 1000px;' '.container { max-width: 1080px;'

# 2a) panel1: params-layout + group1 header
$old = "    <div class=`"panel`">`n        <div class=`"panel-title`">$c1 参数设置</div>`n        <div class=`"controls-grid`">"
$new = "    <div class=`"panel`">`n        <div class=`"panel-title`">$c1 参数设置</div>`n        <div class=`"params-layout`">`n            <div class=`"param-group`">`n                <div class=`"group-label`">电压设置</div>`n                <div class=`"controls-grid two`">"
$text = Do-Replace $text $old $new

# 2b) close group1, open group2
$old = "            </div>`n            <div class=`"control-group`">`n                <label>推荐阻值级别</label>"
$new = "            </div>`n                </div>`n            </div>`n            <div class=`"param-group`">`n                <div class=`"group-label`">推荐条件</div>`n                <div class=`"controls-grid two`">`n            <div class=`"control-group`">`n                <label>推荐阻值级别</label>"
$text = Do-Replace $text $old $new

# 2c) close group2 + params-layout before warn-box
$old = "            </div>`n        </div>`n        <div class=`"warn-box`" id=`"warnBox`"></div>"
$new = "            </div>`n                </div>`n            </div>`n        </div>`n        <div class=`"warn-box`" id=`"warnBox`"></div>"
$text = Do-Replace $text $old $new

# 3) live formula div at bottom of panel2
$old = "        </div>`n    </div>`n`n    <div class=`"panel`">`n        <div class=`"panel-title`">$c3 推荐阻值配比方案"
$new = "        </div>`n        <div class=`"formula-live`" id=`"idealFormula`"></div>`n    </div>`n`n    <div class=`"panel`">`n        <div class=`"panel-title`">$c3 推荐阻值配比方案"
$text = Do-Replace $text $old $new

# 4) els list
$text = Do-Replace $text "'recBody','recNote'" "'recBody','recNote','idealFormula'"

# 5a) renderIdeal invalid: clear formula
$old = "            els.idealR2.textContent = '--'; els.idealIq.textContent = '--';`n            return;"
$new = "            els.idealR2.textContent = '--'; els.idealIq.textContent = '--';`n            els.idealFormula.innerHTML = '';`n            return;"
$text = Do-Replace $text $old $new

# 5b) renderIdeal valid: fill formula
$old = "        els.idealIq.textContent = fmtCurr(state.vcc / (p.r1 + p.r2));`n    }"
$new = "        els.idealIq.textContent = fmtCurr(state.vcc / (p.r1 + p.r2));`n        els.idealFormula.innerHTML = 'Vout = <b>' + fmtNum(state.vcc, 5) + 'V</b> × <b>' + fmtOhm(p.r2) + '</b> / ( <b>' + fmtOhm(p.r1) + '</b> + <b>' + fmtOhm(p.r2) + '</b> ) = <b>' + fmtVolt(state.vout) + '</b>';`n    }"
$text = Do-Replace $text $old $new

# 6) table header merge current+power
$old = "                        <th>静态电流</th>`n                        <th>总功耗</th>"
$new = "                        <th>静态电流 / 功耗</th>"
$text = Do-Replace $text $old $new

# 7) colspan
$text = Do-Replace $text 'colspan="8"' 'colspan="7"'

# 8) rowCells: num classes + merged cell
$text = Do-Replace $text "            + '<td>' + fmtVolt(p.voutAct) + '</td>'" "            + '<td class=`"num`">' + fmtVolt(p.voutAct) + '</td>'"
$text = Do-Replace $text "            + '<td>' + errHtml + '</td>'" "            + '<td class=`"num`">' + errHtml + '</td>'"
$old = "            + '<td>' + fmtCurr(i) + '</td>'`n            + '<td>' + fmtPow(state.vcc * i) + '</td>'"
$new = "            + '<td class=`"num`">' + fmtCurr(i) + '<span class=`"cell-sub`">' + fmtPow(state.vcc * i) + '</span></td>'"
$text = Do-Replace $text $old $new

# 9) rval right align
$text = Do-Replace $text "table.rec td.rval { font-weight: bold; color: var(--text-primary); font-family: Consolas, 'Courier New', monospace; }" "table.rec td.rval { font-weight: bold; color: var(--text-primary); font-family: Consolas, 'Courier New', monospace; text-align: right; }"
