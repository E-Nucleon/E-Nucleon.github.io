package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

/* ================================================================
 * Nucleon Smart Manufacturing — 后端服务
 * 技术栈：Go + Gin + SQLite + GORM
 *
 * 功能：
 *   1. 动态内容管理（动态/项目/友链 CRUD）
 *   2. RSS 自动生成（/api/rss）
 *   3. 留言/联系表单（POST /api/message）
 *   4. 访问统计（中间件自动记录）
 *   5. 管理后台（/admin）
 *
 * 启动：go run .
 * 默认端口 :8080
 * ================================================================ */

func main() {
	// —— 初始化数据库 ——
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "nucleon.db" // 默认 SQLite 文件
	}
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("数据库连接失败: ", err)
	}
	DB = db // 赋值给全局变量

	// 自动建表
	if err := AutoMigrate(db); err != nil {
		log.Fatal("建表失败: ", err)
	}
	// 首次运行插入示例数据
	SeedData(db)

	// —— 配置 Gin ——
	gin.SetMode(gin.ReleaseMode) // 生产模式（关闭调试日志）
	r := gin.Default()

	// —— 全局中间件 ——
	r.Use(VisitMiddleware(db))   // 访问统计

	// —— 静态文件服务 ——
	// 将上级目录的 HTML/CSS/JS/图片作为静态资源服务
	r.StaticFile("/admin", "admin.html")
	r.Static("/css", "../css")
	r.Static("/js", "../js")
	r.Static("/icon", "../icon")
	r.Static("/pictures", "../pictures")
	r.StaticFile("/favicon.ico", "../icon/LOGO_1.png")

	// —— 公开 API（无需认证） ——
	pub := r.Group("/api")
	{
		pub.GET("/news", GetNews)
		pub.GET("/projects", GetProjects)
		pub.GET("/links", GetLinks)
		pub.GET("/stats", GetStats)
		pub.POST("/message", PostMessage)
		pub.GET("/rss", GetRSS)
	}

	// —— 管理后台 API ——
	// 登录接口（无需认证）
	r.POST("/api/admin/login", AdminLogin)

	// 以下接口需要 JWT Token
	admin := r.Group("/api/admin")
	admin.Use(AuthMiddleware())
	{
		// 动态管理
		admin.GET("/news", AdminListNews)
		admin.POST("/news", AdminCreateNews)
		admin.PUT("/news/:id", AdminUpdateNews)
		admin.DELETE("/news/:id", AdminDeleteNews)

		// 项目管理
		admin.GET("/projects", AdminListProjects)
		admin.POST("/projects", AdminCreateProject)
		admin.PUT("/projects/:id", AdminUpdateProject)
		admin.DELETE("/projects/:id", AdminDeleteProject)

		// 友链管理
		admin.GET("/links", AdminListLinks)
		admin.POST("/links", AdminCreateLink)
		admin.PUT("/links/:id", AdminUpdateLink)
		admin.DELETE("/links/:id", AdminDeleteLink)

		// 留言管理
		admin.GET("/messages", AdminListMessages)
		admin.PUT("/messages/:id/read", AdminReadMessage)
		admin.DELETE("/messages/:id", AdminDeleteMessage)

		// 统计详情
		admin.GET("/stats", AdminStatsDetail)
	}

	// —— 首页：直接返回上级 HTML ——
	r.StaticFile("/", "../index.html")

	// —— 启动 ——
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Nucleon 后端启动 → http://localhost:%s\n", port)
	log.Printf("管理后台 → http://localhost:%s/admin\n", port)
	log.Printf("RSS 订阅 → http://localhost:%s/api/rss\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("启动失败: ", err)
	}
}
