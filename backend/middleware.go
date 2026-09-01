package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

/* ================================================================
 * 中间件
 * ================================================================ */

/* JWT 密钥 —— 部署时改成随机字符串 */
var jwtSecret = []byte("nucleon-secret-key-change-me")

/* 生成 JWT Token */
func GenerateToken(username string) (string, error) {
	claims := jwt.MapClaims{
		"username": username,
		"exp":      0, // 不过期（个人站，简化处理）
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

/* 验证 JWT 的中间件 */
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未登录"})
			c.Abort()
			return
		}
		tokenStr := strings.TrimPrefix(auth, "Bearer ")
		token, err := jwt.Parse(tokenStr, jwt.WithValidMethods([]string{"HS256"}))
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token 无效"})
			c.Abort()
			return
		}
		c.Next()
	}
}

/* 访问统计中间件 —— 每次请求记录一条 Visit */
func VisitMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 只记录 GET 请求且非 API/静态资源
		if c.Request.Method != "GET" {
			c.Next()
			return
		}
		path := c.Request.URL.Path
		// 跳过 API 和静态资源
		if strings.HasPrefix(path, "/api/") || strings.HasSuffix(path, ".js") ||
			strings.HasSuffix(path, ".css") || strings.HasSuffix(path, ".png") ||
			strings.HasSuffix(path, ".jpg") || strings.HasSuffix(path, ".ico") ||
			strings.HasSuffix(path, ".svg") || strings.HasSuffix(path, ".woff2") {
			c.Next()
			return
		}
		// 异步写入，不阻塞请求
		go db.Create(&Visit{
			Path:    path,
			IP:      c.ClientIP(),
			UA:      c.GetHeader("User-Agent"),
			Referer: c.GetHeader("Referer"),
		})
		c.Next()
	}
}
