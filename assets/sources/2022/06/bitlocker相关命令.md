# bitlocker相关命令

## 加密

1. 首先检查 BitLocker 状态（在管理员命令提示符中运行）：

```cmd
manage-bde -status
```

2. 启用 BitLocker（假设要加密 C 盘，如果是其他盘符请相应更改）：

```cmd
manage-bde -on C: -UsedSpaceOnly -rp -tpm
```

这个命令的含义：

- -on C: 在 C 盘启用 BitLocker
- -UsedSpaceOnly 只加密已使用的空间（更快）
- -rp 创建恢复密码
- -tpm 使用 TPM 芯片保护

3. 查看保护器信息（包含恢复密钥）：

```cmd
manage-bde -protectors -get C:
```

4. 如果要将恢复密钥保存到文件（替换 PATH 为你想保存的路径）：

```cmd
manage-bde -protectors -get C: > "%USERPROFILE%\Documents\BitLocker_RecoveryKey.txt"
```

5. 如果要暂停加密过程：

```cmd
manage-bde -pause C:
```

6. 如果要恢复加密过程：

```cmd
manage-bde -resume C:
```

7. 如果要关闭 BitLocker：

```cmd
manage-bde -off C:
```

注意事项：

1. 所有命令都需要在管理员权限的命令提示符中运行
1. 请确保你的电脑有 TPM 芯片
1. 请务必保存好恢复密钥，建议保存多个备份
1. 加密过程可能需要较长时间，期间可以正常使用电脑

## 恢复

1. 首先查看当前加密状态：

```cmd
manage-bde -status
```

2. 使用恢复密钥解锁驱动器（假设是 C 盘，请根据实际情况替换盘符）：

```cmd
manage-bde -unlock C: -RecoveryPassword 你的恢复密码
```

注意：恢复密码是一串数字，通常格式如：123456-123456-123456-123456-123456-123456-123456-123456

3. 解锁后，关闭 BitLocker 加密：

```cmd
manage-bde -off C:
```

如果是外置硬盘或者其他计算机的硬盘：

1. 将硬盘连接到电脑后，在 Windows 中会提示输入 BitLocker 恢复密钥
1. 打开 BitLocker_RecoveryKey.txt 文件，找到恢复密码
1. 将恢复密码输入到提示框中即可解锁

如果硬盘无法识别或显示需要格式化：

1. 打开磁盘管理（可以按 Win+X 然后选择磁盘管理）
1. 右键点击被锁定的驱动器
1. 选择"更改驱动器号和路径"
1. 记下分配的盘符
1. 然后使用上述 manage-bde -unlock 命令解锁