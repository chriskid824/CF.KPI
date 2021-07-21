using Convience.JwtAuthentication;
using Convience.ManagentApi.Infrastructure.Logs.LoginLog;
using Convience.Model.Constants;
using Convience.Model.Models.Account;
using Convience.Service.Account;
using Convience.Service.SystemManage;
using Convience.Util.Extension;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Text;
using Convience.Model.Models.SystemManage;
//using Convience.Entity.Entity.test;

namespace Convience.ManagentApi.Controllers
{
    [Route("api")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        public class returnModel
        {
            public returnModel()
            {
                status = true;
            }
            public bool status { get; set; }
            public object data { get; set; }
            public string errMsg { get; set; }
        }
        public class returnData
        {
            public object data { get; set; }
            public string cookies { get; set; }
            public string logonid { get; set; }
            public string password { get; set; }
        }
        public class UserData
        {
            public string USERNAME { get; set; }
            public string CUST_4 { get; set; }
            public string EMAIL { get; set; }
        }
        private readonly IAccountService _loginService;

        private readonly IMenuService _menuService;

        private readonly IRoleService _roleService;
        private readonly IUserService _userService;
        //private readonly IConfigService _configService;
        //private readonly Entity.Data.SystemIdentityDbContext _context;
        //private readonly KPIContext _context;
        public AccountController(IAccountService loginService,
            IMenuService menuService,
            IRoleService roleService,
            IUserService userService
            //IConfigService configService,
            //KPIContext context
            )
        {
            _loginService = loginService;
            _menuService = menuService;
            _roleService = roleService;
            _userService = userService;
            //_configService = configService;
            //_context = context;
        }

        [HttpGet("captcha")]
        public IActionResult GetCaptcha()
        {
            var result = _loginService.GetCaptcha();
            return Ok(result);
        }

        [HttpPost("login")]
        [LoginLogFilter]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            // 验证验证碼
            //var validResult = _loginService.ValidateCaptcha(model.CaptchaKey, model.CaptchaValue);
            //if (!string.IsNullOrEmpty(validResult))
            //{
            //    return this.BadRequestResult(validResult);
            //}
            //驗證是否是否不存在此帳號=>連上bpm驗證是否存在此帳號跟密碼=>新增帳號跟role
            //        var values = new Dictionary<string, string>{
            //    { "logonid", model.UserName },
            //    { "password", model.Password==null?"":model.Password }
            //};
            //var companys=_configService.GetCompanys();
            JObject jobj = new JObject();
            jobj["logonid"] = model.UserName;
            jobj["password"] = model.Password == null ? "" : model.Password;
            HttpClient client = new HttpClient();
            //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage response = await client.PostAsync(
            "http://service3.chenfull.com.tw/CF.BPM.Service/api/EIP/LoginValidate", new StringContent(JsonConvert.SerializeObject(jobj), Encoding.UTF8, "application/json"));
            //"http://10.1.1.180/CF.BPM.Service/api/EIP/LoginValidate", new StringContent(JsonConvert.SerializeObject(jobj), Encoding.UTF8, "application/json"));
            //response.EnsureSuccessStatusCode();
            var aaa = await response.Content.ReadAsStringAsync();
            returnModel returnModel = JsonConvert.DeserializeObject<returnModel>(aaa);
            if (returnModel.errMsg != null && returnModel.errMsg.Length > 0) return this.BadRequestResult(AccountConstants.ACCOUNT_WRONG_INPUT);
            returnData returnData = JsonConvert.DeserializeObject<returnData>(returnModel.data.ToString());
            UserData UserData = JsonConvert.DeserializeObject<UserData>(returnData.data.ToString());
            //如果BPM通過本地不存在就新增
            bool isExsit = _loginService.IsExist(model.UserName);
            if (!isExsit)
            {
                UserViewModel newuser = new UserViewModel()
                {
                    Name = UserData.USERNAME,
                    UserName = model.UserName,
                    Password = model.Password,
                    RoleIds = "7",
                    PositionIds = "",
                    IsActive = true
                };
                await _userService.AddUserAsync(newuser);
            }

            // 验证用户是否可以使用
            //var isActive = _loginService.IsStopUsing(model.UserName);
            //if (!isActive)
            //{
            //    return this.BadRequestResult(AccountConstants.ACCOUNT_NOT_ACTIVE);
            //}

            // 取得用户信息
            var validateResult = await _loginService.ValidateCredentialsAsync(model.UserName, model.Password);
            if (validateResult is null)
            {
                return this.BadRequestResult(AccountConstants.ACCOUNT_WRONG_INPUT);
            }

            // 取得用户部門


            // 取得权限信息
            var menuIds = _roleService.GetRoleClaimValue(validateResult.RoleIds.Split(',',
                StringSplitOptions.RemoveEmptyEntries), CustomClaimTypes.RoleMenus);

            // 获取菜單权限对应的前端标识
            var irs = _menuService.GetIdentificationRoutes(menuIds.ToArray());

            return Ok(new LoginResultModel(
                validateResult.Name,
                validateResult.Avatar,
                validateResult.Token,
                irs.Item1,
                irs.Item2));
        }

        [HttpPost("password")]
        [Authorize]
        public async Task<IActionResult> ChangePwdByOldPwd(ChangePwdViewModel viewmodel)
        {
            var result = await _loginService.ChangePasswordAsync(User.GetUserName(), viewmodel.OldPassword, viewmodel.NewPassword);
            if (!result)
            {
                return this.BadRequestResult(AccountConstants.ACCOUNT_MODIFY_PASSWORD_FAIL);
            }
            return Ok();
        }
    }
}