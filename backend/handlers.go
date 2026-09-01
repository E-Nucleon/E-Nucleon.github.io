package main

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

/* ================================================================
 * 全局数据库实例
 * ================================================================ */
var DB *gorm.DB

/* ================================================================
 * 公开 API（访客可调用）
 * ================================================================ */

/* GET /api/news —— 获取已发布的动态列表 */
func GetNews(c *gin.Context) {
	var news []News
	DB.Find(&news, "published = ?", true)
	c.JSON(http.StatusOK, news)
}

/* GET /api/projects —— 获取项目列表（按排序） */
func GetProjects(c *gin.Context) {
	var projects []Project
	DB.Order("sort_order ASC").Find(&projects)
	c.JSON(http.StatusOK, projects)
}

/* GET /api/links —— 获取友链列表 */
func GetLinks(c *gin.Context) {
	var links []FriendLink
	DB.Order("sort_order ASC").Find(&links)
	c.JSON(http.StatusOK, links)
}

/* GET /api/stats —— 访客统计摘要 */
func GetStats(c *gin.Context) {
	var totalVisits int64
	var todayVisits int64
	DB.Model(&Visit{}).Count(&totalVisits)
	DB.Model(&Visit{}).Where("date(created_at) = date('now')").Count(&todayVisits)

	var unreadMessages int64
	DB.Model(&Message{}).Where("read = ?", false).Count(&unreadMessages)

	c.JSON(http.StatusOK, gin.H{
		"total_visits":     totalVisits,
		"today_visits":     todayVisits,
		"unread_messages":  unreadMessages,
	})
}

/* POST /api/message —— 提交留言/联系表单 */
func PostMessage(c *gin.Context) {
	var msg Message
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	if msg.Name == "" || msg.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "姓名和内容不能为空"})
		return
	}
	msg.IP = c.ClientIP()
	if err := DB.Create(&msg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "留言成功"})
}

/* GET /api/rss —— RSS 订阅源（XML 格式） */
func GetRSS(c *gin.Context) {
	var news []News
	DB.Where("published = ?", true).Order("pub_date DESC").Limit(20).Find(&news)

	siteURL := "https://nucleon.example.com" // 部署时改成你的域名
	siteName := "Nucleon Smart Manufacturing"
	siteDesc := "Nucleon 的个人网站 - EE 开发工具箱、硬件项目、3D 建模与绘画作品、业余无线电"

	xml := `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>` + siteName + `</title>
    <link>` + siteURL + `</link>
    <description>` + siteDesc + `</description>
    <language>zh-CN</language>`

	for _, n := range news {
		xml += fmt.Sprintf(`
    <item>
      <title>%s</title>
      <link>%s/#news</link>
      <description>%s</description>
      <pubDate>%s</pubDate>
      <guid>%s/#news-%d</guid>
    </item>`,
			escapeXML(n.Title),
			siteURL,
			escapeXML(n.Content),
			n.PubDate.Format(time.RFC1123Z),
			siteURL,
			n.ID,
		)
	}

	xml += `
  </channel>
</rss>`

	c.Header("Content-Type", "application/rss+xml; charset=utf-8")
	c.String(http.StatusOK, xml)
}

/* ================================================================
 * 管理后台 API（需要 JWT 认证）
 * ================================================================ */

/* POST /api/admin/login —— 登录获取 Token */
/* 管理员账号密码 —— 部署时改掉 */
var adminUser = "admin"
var adminPass = "nucleon123"

func AdminLogin(c *gin.Context) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	if body.Username != adminUser || body.Password != adminPass {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "账号或密码错误"})
		return
	}
	token, err := GenerateToken(body.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "生成 Token 失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

/* —— 动态管理 CRUD —— */

func AdminListNews(c *gin.Context) {
	var news []News
	DB.Order("pub_date DESC").Find(&news)
	c.JSON(http.StatusOK, news)
}

func AdminCreateNews(c *gin.Context) {
	var n News
	if err := c.ShouldBindJSON(&n); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	if n.PubDate.IsZero() {
		n.PubDate = time.Now()
	}
	DB.Create(&n)
	c.JSON(http.StatusOK, n)
}

func AdminUpdateNews(c *gin.Context) {
	var n News
	if err := DB.First(&n, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "不存在"})
		return
	}
	if err := c.ShouldBindJSON(&n); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	DB.Save(&n)
	c.JSON(http.StatusOK, n)
}

func AdminDeleteNews(c *gin.Context) {
	if err := DB.Delete(&News{}, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "不存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "已删除"})
}

/* —— 项目管理 CRUD —— */

func AdminListProjects(c *gin.Context) {
	var projects []Project
	DB.Order("sort_order ASC").Find(&projects)
	c.JSON(http.StatusOK, projects)
}

func AdminCreateProject(c *gin.Context) {
	var p Project
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	DB.Create(&p)
	c.JSON(http.StatusOK, p)
}

func AdminUpdateProject(c *gin.Context) {
	var p Project
	if err := DB.First(&p, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "不存在"})
		return
	}
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	DB.Save(&p)
	c.JSON(http.StatusOK, p)
}

func AdminDeleteProject(c *gin.Context) {
	if err := DB.Delete(&Project{}, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "不存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "已删除"})
}

/* —— 友链管理 CRUD —— */

func AdminListLinks(c *gin.Context) {
	var links []FriendLink
	DB.Order("sort_order ASC").Find(&links)
	c.JSON(http.StatusOK, links)
}

func AdminCreateLink(c *gin.Context) {
	var l FriendLink
	if err := c.ShouldBindJSON(&l); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	DB.Create(&l)
	c.JSON(http.StatusOK, l)
}

func AdminUpdateLink(c *gin.Context) {
	var l FriendLink
	if err := DB.First(&l, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "不存在"})
		return
	}
	if err := c.ShouldBindJSON(&l); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	DB.Save(&l)
	c.JSON(http.StatusOK, l)
}

func AdminDeleteLink(c *gin.Context) {
	if err := DB.Delete(&FriendLink{}, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "不存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "已删除"})
}

/* —— 留言管理 —— */

func AdminListMessages(c *gin.Context) {
	var messages []Message
	DB.Order("created_at DESC").Find(&messages)
	c.JSON(http.StatusOK, messages)
}

func AdminReadMessage(c *gin.Context) {
	DB.Model(&Message{}).Where("id = ?", c.Param("id")).Update("read", true)
	c.JSON(http.StatusOK, gin.H{"message": "已标记为已读"})
}

func AdminDeleteMessage(c *gin.Context) {
	if err := DB.Delete(&Message{}, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "不存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "已删除"})
}

/* —— 访问统计详情 —— */

func AdminStatsDetail(c *gin.Context) {
	var totalVisits int64
	var todayVisits int64
	var weekVisits int64

	DB.Model(&Visit{}).Count(&totalVisits)
	DB.Model(&Visit{}).Where("date(created_at) = date('now')").Count(&todayVisits)
	DB.Model(&Visit{}).Where("created_at >= datetime('now', '-7 days')").Count(&weekVisits)

	// 最近 7 天每日访问量
	type DailyCount struct {
		Date  string `json:"date"`
		Count int64  `json:"count"`
	}
	var daily []DailyCount
	DB.Raw(`SELECT date(created_at) as date, count(*) as count FROM visits GROUP BY date(created_at) ORDER BY date DESC LIMIT 7`).Scan(&daily)

	var totalMessages int64
	var unreadMessages int64
	DB.Model(&Message{}).Count(&totalMessages)
	DB.Model(&Message{}).Where("read = ?", false).Count(&unreadMessages)

	c.JSON(http.StatusOK, gin.H{
		"total_visits":      totalVisits,
		"today_visits":      todayVisits,
		"week_visits":        weekVisits,
		"daily":              daily,
		"total_messages":     totalMessages,
		"unread_messages":    unreadMessages,
	})
}

/* ================================================================
 * 工具函数
 * ================================================================ */

/* 简单的 XML 转义 */
func escapeXML(s string) string {
	r := strings.NewReplacer(
		"&", "&amp;",
		"<", "&lt;",
		">", "&gt;",
		`"`, "&quot;",
		"'", "&apos;",
	)
	return r.Replace(s)
}
