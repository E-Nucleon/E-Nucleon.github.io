package main

import (
	"time"

	"gorm.io/gorm"
)

/* ================================================================
 * 数据模型定义
 * 每个结构体对应数据库一张表，GORM 自动建表
 * ================================================================ */

/* 动态/新闻 —— 首页"最新动态"时间线的数据 */
type News struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title" gorm:"not null"`
	Content   string    `json:"content" gorm:"not null"`
	PubDate   time.Time `json:"pub_date" gorm:"not null"`
	Published bool      `json:"published" gorm:"default:true"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

/* 项目/作品 —— 首页"项目&作品"卡片的数据 */
type Project struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Title       string `json:"title" gorm:"not null"`
	Description string `json:"description"`
	Image       string `json:"image"`    // 图片路径，如 pictures/projects/xxx.png
	Link        string `json:"link"`     // 跳转链接
	Tags        string `json:"tags"`     // 标签，逗号分隔，如 "硬件设计,LED设计"
	SortOrder   int    `json:"sort_order" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

/* 友链 —— 首页"友链"区块的数据 */
type FriendLink struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Name      string `json:"name" gorm:"not null"`
	Avatar    string `json:"avatar"`  // 头像路径，如 pictures/friends/xxx.jpg
	Url       string `json:"url" gorm:"not null"`
	SortOrder int    `json:"sort_order" gorm:"default:0"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

/* 留言/联系 —— 访客通过联系表单提交的消息 */
type Message struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	Email     string    `json:"email"`
	Content   string    `json:"content" gorm:"not null"`
	IP        string    `json:"-"`           // 不返回给前端
	Read      bool      `json:"read" gorm:"default:false"`
	CreatedAt time.Time `json:"created_at"`
}

/* 访问统计 —— 每次访问记录一条 */
type Visit struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Path      string    `json:"path"`        // 访问的页面路径
	IP        string    `json:"-"`           // 不返回
	UA        string    `json:"-"`           // User-Agent
	Referer   string    `json:"-"`           // 来源
	CreatedAt time.Time `json:"created_at"`
}

/* ================================================================
 * 自动建表 + 初始数据
 * ================================================================ */
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(&News{}, &Project{}, &FriendLink{}, &Message{}, &Visit{})
}

/* 首次运行时插入示例数据 */
func SeedData(db *gorm.DB) error {
	var count int64
	db.Model(&News{}).Count(&count)
	if count > 0 {
		return nil // 已有数据，跳过
	}

	// 示例动态
	news := []News{
		{Title: "个人网站全面重构", Content: "全新深色视觉与模块化结构，后续将持续扩展", PubDate: time.Date(2026, 8, 1, 0, 0, 0, 0, time.UTC), Published: true},
		{Title: "EE 开发工具箱扩充至 38 个工具", Content: "覆盖电源、射频、元器件等方向", PubDate: time.Date(2026, 8, 1, 0, 0, 0, 0, time.UTC), Published: true},
	}
	db.Create(&news)

	// 示例项目
	projects := []Project{
		{Title: "LED大灯泡", Description: "一款复刻游戏《OneShot》的大灯泡。", Image: "pictures/projects/LED大灯泡.png", Link: "https://oshwhub.com/qxqpcb/fu-ke-you-hu-OneShot-Nikode-deng", Tags: "硬件设计,游戏道具复刻", SortOrder: 1},
		{Title: "手提式信标灯", Description: "复刻游戏《OUTER WILDS》中的一款信标灯", Image: "pictures/projects/手提式信标灯.jpeg", Link: "https://oshwhub.com/qxqpcb/portable-beacon-light", Tags: "硬件设计,游戏道具复刻", SortOrder: 2},
	}
	db.Create(&projects)

	// 示例友链
	links := []FriendLink{
		{Name: "好友昵称", Avatar: "pictures/friends/placeholder.png", Url: "example.com", SortOrder: 1},
	}
	db.Create(&links)

	return nil
}
